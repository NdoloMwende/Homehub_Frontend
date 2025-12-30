const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingSpinner;