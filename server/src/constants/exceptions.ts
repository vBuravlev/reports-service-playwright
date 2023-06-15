
/**
 * Общие ошибки
 */
export const INTERNAL_SERVER_ERROR = '500 interval server error';
export const PARAMETERS_FAILED_VALIDATION = 'Ошибка валидации';
export const ID_VALIDATION_ERROR = 'Неверный формат id';

/**
 * Работа с Отчетами
 */
export const REPORT_NOT_FOUND_ERROR = 'Отчет с таким ID не найден';
export const REPORT_NOT_DELETE = 'Отчет с таким ID не был удален';
export const REPORTS_NOT_FOUND_ERROR = 'Отчеты с такими параметрами не найдены';
export const REPORTS_SEARCH_PARAMS_NOT_VALID = 'Параметра поиска отчетов некорректны';

/*
 * Работа с Пользователям
 */

export const USER_EMAIL_ALREADY_EXISTS = 'Пользователь с таким email уже существует';
export const USER_USERNAME_ALREADY_EXISTS = 'Пользователь с таким username уже существует';
export const INCORRECT_EMAIL_OR_PASSWORD = "Некорректный email или пароль";
export const USER_NOT_FOUND_ERROR = 'Пользователь с такимм email не найден';
export const ERROR_ENV_SALT_NOT_FOUND = 'Переменная для соли не найдена';

/**
 * Работа с файлами
 */
export const EXCEPTION_SAVE_FILE = 'Произошла ошибка при сохранении файла';
export const EXCEPTION_CREATE_ARCHIVE = 'Произошла ошибка при создании архива';
export const EXCEPTION_CREATE_DIR = 'Произошла ошибка при создании директории';
export const EXCEPTION_UNPACKING_ARCHIVE = 'Произошла ошибка при распаковке архива';
export const EXCEPTION_REMOVE_DIR = 'Произошла ошибка при удалении директории';
export const EXCEPTION_MOVE_FILE = 'Произошла ошибка при перемещении файла';
export const EXCEPTION_READ_DIR = 'Произошла ошибка чтения директории';

export const FILE_EMPTY = 'Пустой файл';
export const FILE_NOT_ATTACHED = 'Файл не прикреплен';

/**
 * Работа с конфигом
 */

export const CONFIG_NOT_FOUND_ERROR = 'Конфиг с таким ID не найден';
export const CONFIG_NOT_DELETE = 'Конфиг с таким ID не был удален';
export const CONFIG_IS_CURRENT = 'Данный конфиг не может быть текущим используемым, сделайте используемым другой конфиг';
export const CONFIG_IS_DEFAULT = 'Данный конфиг является стандартный, его нельзя удалить';
export const EXCEPTION_CONFIG_SWITCH = 'Произошла ошибка при смене текущего конфига';
export const EXCEPTION_CONFIG = 'Произошла ошибка загрузке конфига';
export const CONFIG_SEARCH_PARAMS_NOT_VALID = 'Параметра поиска конфигов некорректны';


/**
 * Scheduler
 */

export const EXCEPTION_INTERVAL_NOT_FOUND_ERROR = (name: string) => `Interval с именем ${name} не найден`;
export const EXCEPTION_CRON_NOT_FOUND_ERROR = (name: string) => `Cron с именем ${name} не найден`;
export const EXCEPTION_TIMEOUT_NOT_FOUND_ERROR = (name: string) => `Timeout с именем ${name} не найден`;
export const EXCEPTION_CRON = 'Произошла ошибка cron задачи'