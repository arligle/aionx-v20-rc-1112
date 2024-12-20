import {
  DynamicModule,
  Global,
  Inject,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  Provider,
  ValueProvider,
} from '@nestjs/common';
import {
  I18N_LANGUAGES,
  I18N_LOADERS,
  I18N_OPTIONS,
  I18N_RESOLVERS,
  I18N_TRANSLATIONS,
} from './i18n.constants';
import { I18nService } from './services/i18n.service';
import {
  I18nAsyncOptions,
  I18nOptionResolver,
  I18nOptions,
  I18nOptionsFactory,
} from './interfaces/i18n-options.interface';
import { I18nLanguageInterceptor } from './interceptors/i18n-language.interceptor';
import { APP_INTERCEPTOR, HttpAdapterHost } from '@nestjs/core';
import { getI18nResolverOptionsToken } from './decorators/i18n-resolver-options.decorator';
import { isNestMiddleware, shouldResolve, usingFastify } from './utils/util';
import { I18nTranslation } from './interfaces/i18n-translation.interface';
import { I18nLoader } from './loaders/i18n.loader';
import format from 'string-format';
import { I18nMiddleware } from './middlewares/i18n.middleware';
import { processLanguages, processTranslations } from './utils/loaders-utils';
import { isResolverWithOptions } from './utils/type-guards';

export const logger = new Logger('I18nService');

const defaultOptions: Partial<I18nOptions> = {
  resolvers: [],
  formatter: format,
  logging: true,
  throwOnMissingKey: false,
};

@Global()
@Module({})
export class I18nModule implements OnModuleInit, NestModule {
  constructor(
    private readonly i18n: I18nService,
    @Inject(I18N_OPTIONS) private readonly i18nOptions: I18nOptions,
    private adapter: HttpAdapterHost,
  ) {}

  static forRoot(options: I18nOptions): DynamicModule {
    options = this.sanitizeI18nOptions(options);

    const i18nOptions: ValueProvider = {
      provide: I18N_OPTIONS,
      useValue: options,
    };

    const i18nLoaderProvider: ValueProvider = {
      provide: I18N_LOADERS,
      useValue: options.loaders,
    };

    const translationsProvider = {
      provide: I18N_TRANSLATIONS,
      useFactory: async (
        loaders: I18nLoader<unknown>[],
      ): Promise<I18nTranslation> => {
        return processTranslations(loaders);
      },
      inject: [I18N_LOADERS],
    };

    const languagesProvider = {
      provide: I18N_LANGUAGES,
      useFactory: async (loaders: I18nLoader<unknown>[]): Promise<string[]> => {
        return processLanguages(loaders);
      },
      inject: [I18N_LOADERS],
    };

    const resolversProvider = {
      provide: I18N_RESOLVERS,
      useValue: options.resolvers || [],
    };

    return {
      module: I18nModule,
      providers: [
        { provide: Logger, useValue: logger },
        {
          provide: APP_INTERCEPTOR,
          useClass: I18nLanguageInterceptor,
        },
        I18nService,
        i18nOptions,
        translationsProvider,
        languagesProvider,
        resolversProvider,
        i18nLoaderProvider,
        ...this.createResolverProviders(options.resolvers),
      ],
      exports: [I18N_OPTIONS, I18N_RESOLVERS, I18nService, languagesProvider],
    };
  }

  static forRootAsync(options: I18nAsyncOptions): DynamicModule {
    options = this.sanitizeI18nOptions(options);

    const asyncOptionsProvider = this.createAsyncOptionsProvider(options);
    const asyncTranslationProvider = this.createAsyncTranslationProvider();
    const asyncLanguagesProvider = this.createAsyncLanguagesProvider();
    const asyncLoadersProvider = this.createAsyncLoadersProvider();

    const resolversProvider: ValueProvider = {
      provide: I18N_RESOLVERS,
      useValue: options.resolvers || [],
    };

    return {
      module: I18nModule,
      imports: options.imports || [],
      providers: [
        { provide: Logger, useValue: logger },
        {
          provide: APP_INTERCEPTOR,
          useClass: I18nLanguageInterceptor,
        },
        asyncOptionsProvider,
        asyncTranslationProvider,
        asyncLanguagesProvider,
        I18nService,
        resolversProvider,
        asyncLoadersProvider,
        ...this.createResolverProviders(options.resolvers),
      ],
      exports: [
        I18N_OPTIONS,
        I18N_RESOLVERS,
        I18N_LOADERS,
        I18nService,
        asyncLanguagesProvider,
      ],
    };
  }

  private static createAsyncLoadersProvider(): Provider {
    return {
      provide: I18N_LOADERS,
      useFactory: async (options: I18nOptions) => {
        return options.loaders;
      },
      inject: [I18N_OPTIONS],
    };
  }

  private static createAsyncOptionsProvider(
    options: I18nAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      const factory = options.useFactory;

      return {
        provide: I18N_OPTIONS,
        useFactory: async (...args) => {
          const resolvers = await factory(...args);
          return this.sanitizeI18nOptions(resolvers);
        },
        inject: options.inject || [],
      };
    }

    const existingOrClass = options.useClass || options.useExisting;
    if (existingOrClass) {
      return {
        provide: I18N_OPTIONS,
        useFactory: async (optionsFactory: I18nOptionsFactory) =>
          this.sanitizeI18nOptions(
            (await optionsFactory.createI18nOptions()) as any,
          ),
        inject: [existingOrClass],
      };
    }

    throw new Error(
      'Invalid I18n async options, useClass or useExisting or useFactory must be provided',
    );
  }

  private static createAsyncTranslationProvider(): Provider {
    return {
      provide: I18N_TRANSLATIONS,
      useFactory: async (
        loaders: I18nLoader<unknown>[],
      ): Promise<I18nTranslation> => {
        return processTranslations(loaders);
      },
      inject: [I18N_LOADERS],
    };
  }

  private static createAsyncLanguagesProvider(): Provider {
    return {
      provide: I18N_LANGUAGES,
      useFactory: async (loaders: I18nLoader<unknown>[]): Promise<string[]> => {
        return processLanguages(loaders);
      },
      inject: [I18N_LOADERS],
    };
  }

  private static sanitizeI18nOptions<T = I18nOptions | I18nAsyncOptions>(
    options: T,
  ) {
    options = { ...defaultOptions, ...options };
    return options;
  }

  private static createResolverProviders(resolvers?: I18nOptionResolver[]) {
    if (!resolvers || resolvers.length === 0) {
      logger.error(
        `No resolvers provided! @aiofc/i18n won't work properly, please follow the quick-start guide: https://docs.softkit.dev/libraries/i18n/quick-start`,
      );
    }
    return (resolvers || [])
      .filter(shouldResolve)
      .reduce<Provider[]>((providers, r) => {
        if (isResolverWithOptions(r)) {
          const { use: resolver, options, ...rest } = r as any;
          const optionsToken = getI18nResolverOptionsToken(
            resolver as unknown as () => void,
          );
          providers.push({
            provide: resolver,
            useClass: resolver,
          });
          if (options) {
            (rest as any).useValue = options;
          }
          providers.push({
            provide: optionsToken,
            ...(rest as any),
          });
        } else {
          const optionsToken = getI18nResolverOptionsToken(
            r as unknown as () => void,
          );
          providers.push(
            {
              provide: r,
              useClass: r,
              inject: [optionsToken],
            } as any,
            {
              provide: optionsToken,
              useFactory: () => {},
            },
          );
        }

        return providers;
      }, []);
  }

  async onModuleInit() {
    // makes sure languages & translations are loaded before application loads
    await this.i18n.refresh();

    // Register handlebars helper
    if (this.i18nOptions.viewEngine === 'hbs') {
      try {
        const hbs = (await import('hbs')).default;
        hbs.registerHelper('t', this.i18n.hbsHelper);
        logger.log('Handlebars helper registered');
      } catch (error) {
        logger.error('hbs module failed to load', error);
      }
    }

    if (
      this.i18nOptions.viewEngine &&
      ['pug', 'ejs'].includes(this.i18nOptions.viewEngine)
    ) {
      const app = this.adapter.httpAdapter.getInstance();
      app.locals['t'] = (key: string, lang: any, args: any) => {
        return this.i18n.t(key, { lang, args });
      };
    }
  }

  configure(consumer: MiddlewareConsumer) {
    if (this.i18nOptions.disableMiddleware) return;

    const nestMiddleware = isNestMiddleware(consumer);
    consumer
      .apply(I18nMiddleware)
      .forRoutes(nestMiddleware && usingFastify(consumer) ? '(.*)' : '*');
  }
}
