export function success(data: any, message = "Success") {
  return {
    success: true,
    message,
    data,
  };
}

export function error(message = "Error", statusCode = 400) {
  return {
    success: false,
    message,
    statusCode,
  };
}