"use client";

import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { useBuildings } from "@/context/BuildingContext";
import RoomForm from "@/components/buildings/RoomForm";

export default function EditUnitPage() {
  const params = useParams();
  const router = useRouter();
  const { buildings, setBuildings } = useBuildings();
  const [building, setBuilding] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id && params.roomId) {
      const foundBuilding = buildings.find(
        (item) => item.id === Number(params.id)
      );
      if (foundBuilding) {
        setBuilding(foundBuilding);
        const foundRoom = foundBuilding.rooms?.find(
          (item) => item.id === Number(params.roomId)
        );
        if (foundRoom) {
          setRoom(foundRoom);
        }
      }
      setLoading(false);
    }
  }, [params.id, params.roomId, buildings]);

  const handleUpdate = async (updatedRoom) => {
    // Update room in building
    setBuildings((prevBuildings) =>
      prevBuildings.map((b) => {
        if (b.id !== building.id) return b;
        return {
          ...b,
          rooms: b.rooms.map((r) => {
            if (r.id !== room.id) return r;
            return {
              ...updatedRoom,
              id: room.id,
              updatedAt: new Date().toISOString(),
            };
          }),
        };
      })
    );

    // Redirect back to building details
    router.push(`/dashboard/buildings/${building.id}`);
  };

  const handleCancel = () => {
    // Redirect back to building details
    router.push(`/dashboard/buildings/${building.id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading unit details...</div>
      </div>
    );
  }

  if (!building || !room) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Back Button */}
      <Link
        href={`/dashboard/buildings/${building.id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to {building.buildingNo}
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Building2 size={24} className="text-indigo-400" />
          <div>
            <p className="text-sm font-medium text-indigo-400">
              {building.buildingNo}
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Edit Unit {room.unitNo}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Update unit information and rental details.
            </p>
          </div>
        </div>
      </div>

      <RoomForm
        building={building}
        room={room}
        mode="edit"
        onSubmit={handleUpdate}
        onCancel={handleCancel}
      />
    </div>
  );
}