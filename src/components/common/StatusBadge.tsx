// import { type ReactNode } from "react";

// interface StatusBadgeProps {
//   status: "paid" | "pending" | "overdue" | "in-progress" | "completed" | "approved" | "rejected";
//   children?: ReactNode; 
// }

// const StatusBadge = ({ status, children }: StatusBadgeProps) => {
//   const colorMap = {
//     paid: "bg-green-100 text-green-800 border-green-200",
//     pending: "bg-amber-100 text-amber-800 border-amber-200",
//     overdue: "bg-red-100 text-red-800 border-red-200",
//     "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
//     completed: "bg-gray-100 text-gray-800 border-gray-200",
//     approved: "bg-green-100 text-green-800 border-green-200",
//     rejected: "bg-red-100 text-red-800 border-red-200",
//   };

//   const labelMap = {
//     paid: "Paid",
//     pending: "Pending",
//     overdue: "Overdue",
//     "in-progress": "In Progress",
//     completed: "Completed",
//     approved: "Approved",
//     rejected: "Rejected",
//   };

//   const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";

//   return (
//     <span className={`${baseClasses} ${colorMap[status]}`}>
//       {children || labelMap[status]}
//     </span>
//   );
// };

// export default StatusBadge;

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  overdue: "bg-red-100 text-red-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800"
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const style =
    statusStyles[status] ??
    "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-medium rounded ${style}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default StatusBadge;
