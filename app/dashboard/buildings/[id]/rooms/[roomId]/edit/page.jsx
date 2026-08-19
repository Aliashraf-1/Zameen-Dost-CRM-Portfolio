import { notFound } from "next/navigation";

import { buildings } from "@/data/buildings";
import RoomForm from "@/components/buildings/RoomForm";

export default async function EditRoomPage({
  params,
}) {
  const { id, roomId } = await params;

  const building = buildings.find(
    (item) => item.id === Number(id)
  );

  if (!building) {
    notFound();
  }

  const room = building.rooms?.find(
    (item) => item.id === Number(roomId)
  );

  if (!room) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1200px]">

      <div className="mb-8">
        <p className="text-sm text-slate-500">
          {building.buildingNo}
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Edit Unit
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Update unit information and rental details.
        </p>
      </div>

      <RoomForm
        building={building}
        room={room}
        mode="edit"
      />

    </div>
  );
}