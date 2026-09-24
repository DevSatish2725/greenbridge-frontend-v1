function ProfileField({
  icon,
  label,
  value,
  suffix,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[#7a857d]">
        {label}
      </p>

      <div className="mt-1 flex flex-wrap items-center gap-2">
        {icon && <span className="text-[#159447]">{icon}</span>}

        <span className="font-medium text-[#17201a]">{value}</span>

        {suffix}
      </div>
    </div>
  );
}

export default ProfileField