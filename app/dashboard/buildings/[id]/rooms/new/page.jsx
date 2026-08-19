import { notFound } from "next/navigation";

import { buildings } from "@/data/buildings";
import RoomForm from "@/components/buildings/RoomForm";

export default async function NewRoomPage({
  params,
}) {
  const { id } = await params;

  const building = buildings.find(
    (item) => item.id === Number(id)
  );

  if (!building) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">

      <div className="mb-8">
        <p className="mb-1 text-sm font-medium text-indigo-400">
          {building.buildingNo}
        </p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Add New Unit
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Add a room, hall, office or other unit to this
          building.
        </p>
      </div>

      <RoomForm
        building={building}
      />

    </div>
  );
}