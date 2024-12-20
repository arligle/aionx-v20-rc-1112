import { ArgumentsHost } from '@nestjs/common';
import { ErrorResponse, GeneralBadRequestException } from '../../index';
import { I18nContext, I18nValidationException } from '@aiofc/i18n';

export function responseBodyFormatter(
  host: ArgumentsHost,
  exc: I18nValidationException,
  formattedErrors: object,
): Record<string, unknown> {
  const instance = host.switchToHttp().getRequest().requestId;

  const ctx = I18nContext.current();

  return exc instanceof GeneralBadRequestException
    ? ({
        ...exc.toErrorResponse(),
        instance,
        data: formattedErrors,
      } satisfies ErrorResponse)
    : ({
        type: 'todo implement link to docs',
        title: ctx?.translate('exception.BAD_REQUEST.TITLE') || 'Bad Request',
        detail:
          ctx?.translate('exception.BAD_REQUEST.GENERAL_DETAIL') ||
          'Can not validate inbound request body',
        status: exc.getStatus(),
        instance,
        data: formattedErrors,
      } satisfies ErrorResponse);
}
