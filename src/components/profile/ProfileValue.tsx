function ProfileValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
        {label}
      </p>

      <p className="mt-1 font-medium text-text-primary">
        {value}
      </p>
    </div>
  );
}

export default ProfileValue;