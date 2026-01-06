// Định nghĩa các loại lỗi chuẩn hóa
export enum ErrorCode {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_CONNECTION_FAILED = 'API_CONNECTION_FAILED',
  BACKEND_UNREACHABLE = 'BACKEND_UNREACHABLE',
  
  // API errors
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  SESSION_CREATION_FAILED = 'SESSION_CREATION_FAILED',
  SESSION_JOIN_FAILED = 'SESSION_JOIN_FAILED',
  DOWNLOAD_FAILED = 'DOWNLOAD_FAILED',
  HEALTH_CHECK_FAILED = 'HEALTH_CHECK_FAILED',
  
  // File/Upload errors
  FILE_REQUIRED = 'FILE_REQUIRED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_TYPE_NOT_SUPPORTED = 'FILE_TYPE_NOT_SUPPORTED',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  
  // Session errors
  INVALID_CODE = 'INVALID_CODE',
  CODE_EXPIRED = 'CODE_EXPIRED',
  SESSION_NOT_FOUND = 'SESSION_NOT_FOUND',
  SESSION_FULL = 'SESSION_FULL',
  
  // P2P/WebRTC errors
  DATACHANNEL_ERROR = 'DATACHANNEL_ERROR',
  DATACHANNEL_NOT_OPEN = 'DATACHANNEL_NOT_OPEN',
  PEER_CONNECTION_FAILED = 'PEER_CONNECTION_FAILED',
  TRANSFER_FAILED = 'TRANSFER_FAILED',
  MEMORY_ALLOCATION_FAILED = 'MEMORY_ALLOCATION_FAILED',
  
  // WebSocket errors
  WEBSOCKET_CONNECTION_FAILED = 'WEBSOCKET_CONNECTION_FAILED',
  WEBSOCKET_DISCONNECTED = 'WEBSOCKET_DISCONNECTED',
  
  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  userMessage: string;
  details?: any;
  timestamp: Date;
}

// Mapping error codes to user-friendly messages (tiếng Việt)
export const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.NETWORK_ERROR]: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.',
  [ErrorCode.API_CONNECTION_FAILED]: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
  [ErrorCode.BACKEND_UNREACHABLE]: 'Máy chủ không phản hồi. Vui lòng đảm bảo Cloudflare Function có thể truy cập được.',
  
  [ErrorCode.INVALID_RESPONSE]: 'Phản hồi không hợp lệ từ máy chủ.',
  [ErrorCode.SESSION_CREATION_FAILED]: 'Tạo phiên chia sẻ thất bại. Vui lòng thử lại.',
  [ErrorCode.SESSION_JOIN_FAILED]: 'Tham gia phiên chia sẻ thất bại. Vui lòng kiểm tra mã.',
  [ErrorCode.DOWNLOAD_FAILED]: 'Tải xuống thất bại. Vui lòng thử lại.',
  [ErrorCode.HEALTH_CHECK_FAILED]: 'Kiểm tra trạng thái máy chủ thất bại.',
  
  [ErrorCode.FILE_REQUIRED]: 'Vui lòng chọn file để tải lên.',
  [ErrorCode.FILE_TOO_LARGE]: 'File quá lớn. Vui lòng chọn file nhỏ hơn.',
  [ErrorCode.FILE_TYPE_NOT_SUPPORTED]: 'Loại file không được hỗ trợ.',
  [ErrorCode.UPLOAD_FAILED]: 'Tải lên thất bại. Vui lòng thử lại.',
  
  [ErrorCode.INVALID_CODE]: 'Mã không hợp lệ. Vui lòng kiểm tra lại.',
  [ErrorCode.CODE_EXPIRED]: 'Mã đã hết hạn. Vui lòng yêu cầu mã mới.',
  [ErrorCode.SESSION_NOT_FOUND]: 'Không tìm thấy mã. Vui lòng kiểm tra lại mã 6 số.',
  [ErrorCode.SESSION_FULL]: 'Phiên chia sẻ đã đầy.',
  
  [ErrorCode.DATACHANNEL_ERROR]: 'Lỗi kênh dữ liệu. Vui lòng thử lại.',
  [ErrorCode.DATACHANNEL_NOT_OPEN]: 'Kênh dữ liệu chưa sẵn sàng.',
  [ErrorCode.PEER_CONNECTION_FAILED]: 'Kết nối ngang hàng thất bại.',
  [ErrorCode.TRANSFER_FAILED]: 'Truyền file thất bại. Vui lòng thử lại.',
  [ErrorCode.MEMORY_ALLOCATION_FAILED]: 'Không đủ bộ nhớ để xử lý file.',
  
  [ErrorCode.WEBSOCKET_CONNECTION_FAILED]: 'Kết nối WebSocket thất bại.',
  [ErrorCode.WEBSOCKET_DISCONNECTED]: 'Mất kết nối WebSocket.',
  
  [ErrorCode.UNKNOWN_ERROR]: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.',
  [ErrorCode.VALIDATION_ERROR]: 'Dữ liệu không hợp lệ.',
  [ErrorCode.PERMISSION_DENIED]: 'Bạn không có quyền thực hiện thao tác này.',
};

// Tạo lỗi chuẩn hóa
export class StandardError extends Error {
  public readonly code: ErrorCode;
  public readonly userMessage: string;
  public readonly details?: any;
  public readonly timestamp: Date;

  constructor(code: ErrorCode, message?: string, details?: any) {
    const userMessage = message || errorMessages[code];
    super(userMessage);
    
    this.code = code;
    this.userMessage = userMessage;
    this.details = details;
    this.timestamp = new Date();
    
    this.name = 'StandardError';
  }

  toJSON(): AppError {
    return {
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

// Factory functions để tạo các loại lỗi phổ biến
export const createNetworkError = (details?: any) => 
  new StandardError(ErrorCode.NETWORK_ERROR, undefined, details);

export const createApiConnectionError = (details?: any) => 
  new StandardError(ErrorCode.API_CONNECTION_FAILED, undefined, details);

export const createFileRequiredError = () => 
  new StandardError(ErrorCode.FILE_REQUIRED);

export const createInvalidCodeError = () => 
  new StandardError(ErrorCode.INVALID_CODE);

export const createCodeExpiredError = () => 
  new StandardError(ErrorCode.CODE_EXPIRED);

export const createTransferFailedError = (details?: any) => 
  new StandardError(ErrorCode.TRANSFER_FAILED, undefined, details);

export const createDataChannelError = (details?: any) => 
  new StandardError(ErrorCode.DATACHANNEL_ERROR, undefined, details);

export const createUnknownError = (originalError?: any) => 
  new StandardError(ErrorCode.UNKNOWN_ERROR, undefined, originalError);

// Helper function để convert các lỗi khác thành StandardError
export const normalizeError = (error: any): StandardError => {
  if (error instanceof StandardError) {
    return error;
  }

  // Convert từ ApiError
  if (error?.error && error?.code) {
    const errorCode = mapApiErrorToErrorCode(error.code);
    return new StandardError(errorCode, error.error, error);
  }

  // Convert từ Error thông thường
  if (error instanceof Error) {
    // Map các message lỗi phổ biến
    if (error.message.includes('fetch')) {
      return createApiConnectionError(error);
    }
    if (error.message.includes('network')) {
      return createNetworkError(error);
    }
    if (error.message.includes('Data channel')) {
      return createDataChannelError(error);
    }
  }

  // Default case
  return createUnknownError(error);
};

// Map API error codes sang ErrorCode
const mapApiErrorToErrorCode = (apiCode: number): ErrorCode => {
  switch (apiCode) {
    case 400:
      return ErrorCode.VALIDATION_ERROR;
    case 401:
      return ErrorCode.PERMISSION_DENIED;
    case 404:
      return ErrorCode.SESSION_NOT_FOUND;
    case 410:
      return ErrorCode.CODE_EXPIRED;
    case 429:
      return ErrorCode.SESSION_FULL;
    case 500:
    case 502:
    case 503:
      return ErrorCode.API_CONNECTION_FAILED;
    default:
      return ErrorCode.UNKNOWN_ERROR;
  }
};

// Logger để thay thế console.log/error
export class ErrorLogger {
  static error(error: StandardError | Error | string, context?: string) {
    const standardError = typeof error === 'string' 
      ? createUnknownError(error) 
      : normalizeError(error);
    
    const logData = {
      ...standardError.toJSON(),
      context,
      stack: standardError.stack,
    };

    // Trong development, log ra console
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.error('[ERROR]', logData);
    }

    // Trong production, có thể gửi đến logging service
    // TODO: Implement logging service integration
  }

  static warn(message: string, context?: string) {
    const logData = { message, context, timestamp: new Date() };
    
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.warn('[WARN]', logData);
    }
  }

  static info(message: string, context?: string) {
    const logData = { message, context, timestamp: new Date() };
    
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.info('[INFO]', logData);
    }
  }
}
