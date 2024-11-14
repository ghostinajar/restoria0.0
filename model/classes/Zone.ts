// Zone
import mongoose from "mongoose";
import historySchema, { IHistory } from "./History.js";
import descriptionSchema, { IDescription } from "./Description.js";
import roomSchema, { IRoom } from "./Room.js";
import mobBlueprintSchema, { IMobBlueprint } from "./MobBlueprint.js";
import itemBlueprintSchema, { IItemBlueprint } from "./ItemBlueprint.js";
import suggestionSchema, { ISuggestion } from "./Suggestion.js";
import logger from "../../logger.js";
import { IItemNode } from "./ItemNode.js";
import { IMobNode } from "./MobNode.js";
import catchErrorHandlerForFunction from "../../util/catchErrorHandlerForFunction.js";

const { Schema } = mongoose;

export interface IZone extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  name: string;
  history: IHistory;
  description: IDescription;
  rooms: Array<IRoom>;
  mobBlueprints: Array<IMobBlueprint>;
  itemBlueprints: Array<IItemBlueprint>;
  suggestions: Array<ISuggestion>;
  minutesToRespawn: number;

  initRooms(): Promise<void>;
  clearRooms(): Promise<void>;
  eraseItemBlueprintById(id: string): Promise<void>;
  eraseMobBlueprintById(id: string): Promise<void>;
  eraseRoomById(id: string): Promise<void>;
}

const zoneSchema = new Schema({
  _id: Schema.Types.ObjectId,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  history: {
    type: historySchema,
    default: () => ({}),
  },
  description: {
    type: descriptionSchema,
    default: () => ({}),
  },
  rooms: [
    {
      type: roomSchema,
      default: () => [],
    },
  ],
  mobBlueprints: [
    {
      type: mobBlueprintSchema,
      default: () => [],
    },
  ],
  itemBlueprints: [
    {
      type: itemBlueprintSchema,
      default: () => [],
    },
  ],
  suggestions: [
    {
      type: suggestionSchema,
      default: () => ({}),
    },
  ],
  minutesToRespawn: {
    type: Number,
    default: 15,
    min: [
      5,
      "The value of `{PATH}` (`{VALUE}`) is beneath the limit of `{MIN}`.",
    ],
    max: [
      120,
      "The value of `{PATH}` (`{VALUE}`) exceeds the limit of `{MAX}`.",
    ],
  },
});

zoneSchema.methods.initRooms = async function () {
  try {
    //instantiate room instances
    for (const room of this.rooms) {
      await room.initiate(); //setup room's contents arrays (inventory, mobs, users)
    }
    return;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`Zone.initRooms`, error);
  }
};

zoneSchema.methods.clearRooms = async function () {
  try {
    // Clear each room's contents
    for (const room of this.rooms.values()) {
      // Assuming each room has a method to clear its contents
      // logger.debug(`Clearing contents of room "${room.name}"`);
      await room.clearContents();
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`Zone.clearRooms`, error);
  }
};

zoneSchema.methods.eraseItemBlueprintById = async function (id: string) {
  try {
    // Remove the item blueprint from the zone
    this.itemBlueprints = this.itemBlueprints.filter(
      (blueprint: IItemBlueprint) => blueprint._id.toString() !== id.toString()
    );

    // Remove its itemNodes from all rooms
    this.rooms.forEach((room: IRoom) => {
      room.itemNodes = removeNodesWithBlueprintId(id, room.itemNodes);
    });

    // Remove its itemNodes from other itemBlueprints
    this.itemBlueprints.forEach((itemBlueprint: IItemBlueprint) => {
      if (itemBlueprint.itemNodes) {
        itemBlueprint.itemNodes = removeNodesWithBlueprintId(
          id,
          itemBlueprint.itemNodes
        );
      }
    });

    // Remove its itemNodes from mobBlueprints
    this.mobBlueprints.forEach((mobBlueprint: IMobBlueprint) => {
      mobBlueprint.itemNodes = removeNodesWithBlueprintId(
        id,
        mobBlueprint.itemNodes
      );
    });
    await this.save();
    await this.initRooms();
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`Zone.eraseItemBlueprintById`, error);
  }
};

zoneSchema.methods.eraseMobBlueprintById = async function (id: string) {
  try {
    // Remove the mob blueprint from the zone
    this.mobBlueprints = this.mobBlueprints.filter(
      (blueprint: IMobBlueprint) => blueprint._id.toString() !== id.toString()
    );

    // Remove its mobNodes from all rooms
    this.rooms.forEach((room: IRoom) => {
      room.mobNodes = removeNodesWithBlueprintId(id, room.mobNodes);
    });
    await this.save();
    await this.initRooms();
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`Zone.eraseMobBlueprintById`, error);
  }
};

zoneSchema.methods.eraseRoomById = async function (id: string) {
  try {
    // Remove the room from the zone
    this.rooms = this.rooms.filter(
      (room: IRoom) => room._id.toString() !== id.toString()
    );

    // Define a type for the valid direction keys
    type Direction = "north" | "east" | "south" | "west" | "up" | "down";

    // Loop through each room and remove exits that lead to the deleted room
    this.rooms.forEach((room: IRoom) => {
      const directions: Direction[] = [
        "north",
        "east",
        "south",
        "west",
        "up",
        "down",
      ];

      directions.forEach((direction) => {
        const exit = room.exits[direction];
        if (
          exit &&
          exit.destinationLocation &&
          exit.destinationLocation.inRoom.toString() === id.toString()
        ) {
          delete room.exits[direction]; // Remove the exit if it leads to the deleted room
        }
      });
    });
    await this.save();
    await this.initRooms();
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`Zone.eraseRoomById`, error);
  }
};

// Helper function to remove nodes by blueprint id
const removeNodesWithBlueprintId = (
  id: string,
  nodes: Array<IItemNode> | Array<IMobNode>
) => {
  return nodes.filter(
    (node) => node.loadsBlueprintId.toString() !== id.toString()
  );
};

const Zone = mongoose.model("Zone", zoneSchema);

export default Zone;
