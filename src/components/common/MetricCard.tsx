interface MetricCardProps {
  label: string;
  value: string | number;
}

const MetricCard = ({ label, value }: MetricCardProps) => {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
};

export default MetricCard;
