interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message = "Something went wrong", onRetry }: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md border px-4 py-2 hover:bg-muted"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;