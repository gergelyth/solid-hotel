/** The main room definition type containing description information about a room at the hotel. */
export type RoomDefinition = {
  id: string | null;
  name: string;
  description?: string;
};
