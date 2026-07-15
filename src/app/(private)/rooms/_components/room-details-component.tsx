/** biome-ignore-all assist/source/organizeImports: reason */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { client } from "@/lib/orpc";
import type { Row } from "@tanstack/react-table";

type RoomDetailsComponentProps = {
  row: Row<Awaited<ReturnType<typeof client.room.getRoomById>>>;
};
export const RoomDetailsComponent = ({ row }: RoomDetailsComponentProps) => {
  const { original } = row;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Room Occupants</CardTitle>
        <CardDescription>
          Below is the list of students who occupy {original.house.name}{" "}
          {original.rmGender?.toLowerCase()} room #
          {Number(original.code.slice(2))}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <div className="border rounded-lg">
          <div className="grid grid-cols-3 gap-2 border-b py-3 px-2">
            <div>Name</div>
            <div>Gender</div>
            <div>Contact</div>
          </div>
          {original.students.map((student) => (
            <div
              key={student.id}
              className="grid grid-cols-3 gap-2 last-of-type:border-b py-3 px-2">
              <div>
                {student.lastName} {student.firstName} {student.middleName}
              </div>
              <div>{student.gender}</div>
              <div>{student.phone}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
