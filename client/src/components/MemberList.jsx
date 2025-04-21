import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MemberRow = ({ member }) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle">{member.name}</td>
    <td className="p-4 align-middle">{member.email}</td>
    <td className="p-4 align-middle">{member.role}</td>
  </tr>
);

export default function MemberList() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch("http://localhost:5050/member/");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMembers();
  }, []);

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Members</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Email
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {members.map((member) => (
                <MemberRow key={member._id} member={member} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
