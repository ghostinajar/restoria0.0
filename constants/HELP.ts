// HELP

import padStringToLength79 from "../util/padStringToLength79.js";

// Arrays of help messages for the HELP command
const HELP: {
  [key: string]: string[];
} = {
  AFFIX: [
    `This feature is still in development.`,
    `${padStringToLength79(`Affix`)}`,
    `An affix boosts a stat on a mob, item, or target of a spell. The effect of each stat is explained in a help file (e.g. HELP DEXTERITY). An item can have 0-3 affixes, and a mob can have 0-5. It's okay to have no affixes, or more than one affix on the same stat, e.g. for a double or triple boost to dexterity on the same boots, or a minotaur that is extra, extra, extra strong.`,
  ],
  AGGRESSIVE_MOB: [
    `${padStringToLength79(`Aggressive Mob`)}`,
    `This feature is still in development. When implemented, An aggressive mob will attack users without being provoked.`,
  ],
  ARMOR: [
    `${padStringToLength79(`Armor`)}`,
    `An armor item may fit on one location, or have multiple options. (e.g. a long, golden chain might fit around the neck or around the waist)`,
  ],
  AUTHOR: [
    `${padStringToLength79(`Author, Character, User`)}`,
    `The words author, character, and user all refer to the same thing: a human person who plays Restoria. Everyone in the game is an author in the sense that they can CREATE zones and their contents. We are all users and characters in the sense that we interact with the world of zones created by other authors, often in a role-playing style of gameplay. A person may have multiple user accounts representing different characters. That's why "user", "character", and "author" are used interchangeably in Restoria.`,
  ],
  CHEATSHEET: [
    `${padStringToLength79(`HELP CHEATSHEET`)}`,
    `Here are some commands to try after login:`,
    `<span style="color:var(--green)">NORTH</span>, <span style="color:var(--green)">EAST</span>, <span style="color:var(--green)">SOUTH</span>, <span style="color:var(--green)">WEST</span>, <span style="color:var(--green)">UP</span>, <span style="color:var(--green)">DOWN</span>: move one room in any direction`,
    `<span style="color:var(--green)">LOOK:</span> see what (and who) is in the room with you`,
    `<span style="color:var(--green)">RECALL:</span> warp back to "The Snails", the centre of Restoria Town`,
    `<span style="color:var(--green)">CREATE:</span> start with CREATE ZONE to write things into the game`,
    `<span style="color:var(--green)">GOTO:</span> warp to any room in any zone you create or edit`,
    `<span style="color:var(--green)">EDIT:</span> make changes to an item, mob, room, etc. you've created`,
    `<span style="color:var(--green)">ERASE:</span> remove something you've created from the game`,
    `<span style="color:var(--green)">EDITOR:</span> choose another user to make suggestions in your zones`,
    `<span style="color:var(--green)">SUGGEST:</span> leave a suggestion for an author to improve something`,
    `<span style="color:var(--green)">SUGGESTIONS:</span> view suggestions from your editor in your zone`,
    `<span style="color:var(--green)">SAY:</span> send a message to users in the same room`,
    `<span style="color:var(--green)">SHOUT:</span> send a message to users in the same zone`,
    `<span style="color:var(--green)">TELEPATH:</span> send a message to a single user`,
    `<span style="color:var(--green)">RULES:</span> read and follow these if you want to stay in Restoria`,
    `Type <span style="color:var(--green)">HELP CHEATSHEET</span> in-game to see this again.`,
  ],
  CONTAINER: [
    `${padStringToLength79(`CONTAINER, CAPACITY`)}`,
    `A container is an item that can hold other (non-container) items inside. A container's capacity is the maximum items it can store (10, by default).`,
  ],
  CREATE: [
    `${padStringToLength79(`CREATE`)}`,
    `You are an author in Restoria, and authors can CREATE ZONE, CREATE ITEM, CREATE MOB, CREATE ROOM, and CREATE EXIT to add things to zones they own. Each option opens a form to enter your writing, and the HELP for each form will display automatically when it opens.`,
  ],
  CREATE_EXIT: [
    `${padStringToLength79(`CREATE EXIT`)}`,
    `Open an exit between this room and an adjacent room. If there's no available room in a direction, it won't appear on the form. If the "Direction" dropdown is empty, try CREATE ROOM instead.`,
  ],
  CREATE_ITEM: [
    `${padStringToLength79(`CREATE ITEM`)}`,
    `<span style="color:var(--red)">Name:</span> e.g '<span style="color: var(--blue_light)">a green potion</span>' or '<span style="color: var(--blue_light)">Excaliburr the Frozen'</span>`,
    `<span style="color:var(--red)">Keywords:</span> e.g 'potion, green' or 'sword, Excaliburr, Frozen'`,
    `<span style="color:var(--red)">Type:</span> gives an item certain behaviours`,
    `<span style="color:var(--red)">MinLvl:</span> player must be at least this level to use or equip it`,
    `<span style="color:var(--red)">Price:</span> costs to purchase (selling price will be less)`,
    `<span style="color:var(--red)">Container:</span> this item may spawn or hold other items inside`,
    `<span style="color:var(--red)">Look:</span> how the player sees the item when they look or enter a room`,
    `<span style="color:var(--red)">Examine:</span> a paragraph a player seens when they examine the item.`,
  ],
  CREATE_MOB: [
    `${padStringToLength79(`CREATE MOB`)}`,
    `<span style="color:var(--red)">Name:</span> e.g '<span style="color: var(--green_light)">a green goblin</span>' or '<span style="color: var(--green_light)">Greg the blacksmith'</span>`,
    `<span style="color:var(--red)">Keywords:</span> e.g 'goblin, green' or 'blacksmith, Greg'`,
    `<span style="color:var(--red)">Pronouns:</span> may appear in place of a name ("Greg eats." vs "<u>He</u> eats.")`,
    `<span style="color:var(--red)">Level:</span> determines its stats and learned spells and abilities`,
    `<span style="color:var(--red)">Job:</span> determines abilities and combat style`,
    `<span style="color:var(--red)">Look:</span> how the player sees the mob when they look or enter a room`,
    `<span style="color:var(--red)">Examine:</span> a paragraph a player sees when they examine the mob`,
  ],
  CREATE_ROOM: [
    `${padStringToLength79(`CREATE ROOM`)}`,
    `<span style="color:var(--red)">Name:</span> e.g '<span style="color: var(--yellow_light)">A Long Hallway</span>' or '<span style="color: var(--yellow_light)">The Potion Shoppe'</span>`,
    `<span style="color:var(--red)">Direction:</span> the location of the new room, from where you create it`,
    `<span style="color:var(--red)">Dark:</span> items, mobs, and players are hidden unless a lamp is present`,
    `<span style="color:var(--red)">Indoors:</span> weather won't take effect here`,
    `<span style="color:var(--red)">On Water:</span> players and mobs can't enter without levitate`,
    `<span style="color:var(--red)">Underwater:</span> players will take drowning damage without magic`,
    `<span style="color:var(--red)">Examine:</span> a paragraph a player sees when they look or enter the room`,
  ],
  CREATE_USER: [
    `${padStringToLength79(`CREATE USER`)}`,
    `This command is currently disabled during Beta testing.`,
    `<span style="color:var(--red)">Name:</span> must be letters only (max. 18), no unique irl names (e.g. no "Obama")`,
    `<span style="color:var(--red)">Password:</span> has min. 8 characters, including uppercase, lowercase, <u>and</u> number`,
    `<span style="color:var(--red)">Pronouns:</span> may appear in place of a name ("Greg eats." vs "<u>He</u> eats.")`,
    `<span style="color:var(--red)">Job:</span> determines abilities, spells, and fighting style in combat`,
  ],
  CREATE_ZONE: [
    `${padStringToLength79(`CREATE ZONE, EDIT ZONE`)}`,
    `<span style="color:var(--red)">Name:</span> the zone's title, e.g. "The Mushroom City"`,
    `<span style="color:var(--red)">Respawn:</span> how many minutes before the whole zone's mobs, doors, & items respawn`,
    `<span style="color:var(--red)">Look:</span> a sentence shown to a player when they survey the wilderness nearby`,
    `e.g. "Clouds of spores and odd, fungal shapes protrude from the horizon."`,
    `<span style="color:var(--red)">Examine:</span> a paragraph a player sees when they examine the zone`,
    `<span style="color:var(--red)">Study:</span> a player learns some more details when they study the zone`,
    `<span style="color:var(--red)">Research:</span> the full history of the zone, in paragraphs`,
    `A good research text rewards the reader with some secrets about the zone.`,
  ],
  DESCRIPTION: [
    `${padStringToLength79(`DESCRIPTION, LOOK, EXAMINE, STUDY, RESEARCH`)}`,
    `<span style="color:var(--red)">Look:</span> A 'look' description should fit on one line (80 characters or less). It is a full sentence, and a reader's first impression of the item, mob, user, or zone it describes. The 'look' descriptions of every item, mob, and user in a room are shown automatically to a player when they enter that room, and when they use the LOOK command on its own. Users can't change their own 'look' descriptions. A room has no 'look' description (its 'examine' description is used for both).`,
    `<span style="color:var(--red)">Examine:</span> When a reader uses the EXAMINE command on an item, mob, or user, this short paragraph (240 characters or less) is what they see. For a room, the 'examine' description is shown for both EXAMINE and LOOK commands (ie. a user also automatically sees a room's 'examine' description when they enter it, and when they use the LOOK command on its own.`,
    `<span style="color:var(--red)">Study:</span> When a reader uses the STUDY command on an item, mob, user, room, or zone, this long description (640 characters or less) is what they see. It should include rich detail that a reader wouldn't notice at first glance, and may even share secrets to reward those careful and patient readers who take the time to STUDY.`,
    `<span style="color:var(--red)">Research:</span> When a reader uses the RESEARCH command on an item, mob, user, room, or zone, this complete story (1600 characters or less) is shown to them. Good authors will use the 'research' description to tell some history. They may explain why certain things in their zone are they way they are. This is also a fun place to include easter eggs or major secrets about your zone, since only the best and most deserving readers explore with the RESEARCH command.`,
  ],
  EDIT: [
    `${padStringToLength79(`EDIT`)}`,
    `After creating a zone, item, mob, room, or user in Restoria, you can use EDIT to change or add more details. EDIT ITEM, EDIT MOB, and EDIT ROOM allow many options for customization, while EDIT USER and EDIT ZONE allow only basic description changes, for now. Each option opens a form to edit text and options, and the HELP for each form will display automatically when it opens.`,
  ],
  EDIT_ITEM: [
    `${padStringToLength79(`EDIT ITEM`)}`,
    `<span style="color:var(--red)">Name:</span> e.g '<span style="color: var(--blue_light)">a green potion</span>' or '<span style="color: var(--blue_light)">Excaliburr the Frozen'</span>`,
    `<span style="color:var(--red)">Keywords:</span> e.g 'potion, green' or 'sword, Excaliburr, Frozen'`,
    `<span style="color:var(--red)">Price:</span> the cost to purchase (selling price will be less)`,
    `<span style="color:var(--red)">MinLvl:</span> a player must be at least this level to use or equip it`,
    `<span style="color:var(--red)">Type:</span> gives an item certain behaviours`,
  ],
  EDIT_MOB: [
    `${padStringToLength79(`EDIT MOB`)}`,
    `<span style="color:var(--red)">Name:</span> e.g '<span style="color: var(--green_light)">a green goblin</span>' or '<span style="color: var(--green_light)">Greg the blacksmith'</span>`,
    `<span style="color:var(--red)">Keywords:</span> e.g 'goblin, green' or 'blacksmith, Greg'`,
    `<span style="color:var(--red)">Pronouns:</span> may appear in place of a name ("Greg eats." vs "<u>He</u> eats.")`,
    `<span style="color:var(--red)">Level:</span> determines its stats and learned spells and abilities`,
    `<span style="color:var(--red)">Job:</span> determines abilities and combat style`,
  ],
  EDIT_ROOM: [
    `${padStringToLength79(`EDIT ROOM Description`)}`,
    `<span style="color:var(--red)">Name:</span> e.g '<span style="color: var(--yellow_light)">A Long Hallway</span>' or '<span style="color: var(--yellow_light)">The Potion Shoppe'</span>`,
    `<span style="color:var(--red)">Examine:</span> a paragraph a player sees when they look or enter the room`,
    `<span style="color:var(--red)">Study:</span> a player learns some history when they study the room`,
    `<span style="color:var(--red)">Research:</span> tells the full history of the room, in paragraphs`,
    `A good research text rewards the reader with some secrets about the room. Read HELP DESCRIPTION for more.`,
  ],
  EDIT_ROOM_TAGS: [
    `${padStringToLength79(`EDIT ROOM Tags`)}`,
    `<span style="color:var(--red)">Dark:</span> items, mobs, and players are hidden unless a lamp is present`,
    `<span style="color:var(--red)">Indoors:</span> weather won't take effect here`,
    `<span style="color:var(--red)">On Water:</span> players and mobs can't enter without levitate`,
    `<span style="color:var(--red)">Underwater:</span> players will take drowning damage without magic`,
    `<span style="color:var(--red)">No Mounts:</span> no one can enter this room while mounted`,
    `<span style="color:var(--red)">No Mobs:</span> mobs can't enter this room`,
    `<span style="color:var(--red)">No Magic:</span> no one can cast spells in this room`,
    `<span style="color:var(--red)">No Combat:</span> no one can enter combat in this room`,
  ],
  EDIT_USER: [
    `${padStringToLength79(`EDIT USER`)}`,
    `<span style="color:var(--red)">Name:</span> must be letters only (max. 18), no unique irl names (e.g. no "Obama")`,
    `<span style="color:var(--red)">Password:</span> has min. 8 characters, including uppercase, lowercase, <u>and</u> number`,
    `<span style="color:var(--red)">Pronouns:</span> may appear in place of a name ("Greg eats." vs "<u>He</u> eats.")`,
    `<span style="color:var(--red)">Job:</span> determines abilities, spells, and fighting style in combat`,
    `Read HELP DESCRIPTION for more.`,
  ],
  EDITOR: [
    `${padStringToLength79(`EDITOR`)}`,
    `The EDITOR command designates another user to be your zone editor (e.g. EDITOR RALU). The person you choose can enter your unpublished zones and read all your content. They can also use the SUGGEST command to give you notes to improve your zone.`,
  ],
  ERASE: [
    `${padStringToLength79(
      `ERASE, DELETE, ERASE ITEM, ERASE MOB, ERASE ROOM, ERASE USER, ERASE ZONE`
    )}`,
    `Use the ERASE or DELETE command to ERASE ITEM, ERASE MOB, or ERASE ROOM in your zone. To erase a user, contact Ralu or another game administrator. Except in special circumstances, we'll only erase one of your users per month. You can't erase a zone; edit or erase its contents instead.`,
    `Remember, <span style="color:var(--red)">ERASE cannot be undone!</span> We recommend saving all your writing somewhere, (e.g. Google Drive), so you have a back-up copy of your hard work. Some wise authors do all their writing in another doc, then copy/paste into Restoria. Why not back up your writing before you ERASE, just in case?`,
  ],
  ERASE_EXIT: [
    `${padStringToLength79(`ERASE EXIT`)}`,
    `Remove an exit between this room and an adjacent room. Erasing an exit can make some rooms in your zone inaccessible. You can use GOTO, then CREATE EXIT or CREATE ROOM to reconnect them.`,
  ],
  EXITS: [
    `${padStringToLength79(`EXITS, EDIT ROOM Exits`)}`,
    `Exits allow users and mobs to move between rooms in a zone. An exit will always spawn closed and locked if a key is assigned to it.`,
    `<span style="color:var(--red)">Key:</span> someone can unlock the exit if this item is in their inventory`,
    `<span style="color:var(--red)">Hidden:</span> exit can't be seen or used, except by those who successfully SEARCH`,
    `<span style="color:var(--red)">Closed:</span> closed by default when the zone is spawned`,
  ],
  FINESSE_WEAPON: [
    `This feature is still in development.`,
    `${padStringToLength79(`Finesse Weapon`)}`,
  ],
  GOTO: [
    `${padStringToLength79(`GOTO`)}`,
    `Choose any room in any unpublished zone you created, or any zone of an author who chose you as their EDITOR.`,
  ],
  HIDDEN: [
    `This feature is still in development.`,
    `${padStringToLength79(
      `HIDDEN_ITEM, HIDDEN_USER, HIDDEN_MOB, HIDDEN_EXIT`
    )}`,
  ],
  ITEM_NODE: [
    `${padStringToLength79(`Item Node`)}`,
    `<span style="color:var(--red)">Capacity:</span> how many items can fit inside. An item node spawns that item into container, mob inventory, or room when the zone is spawned. Choose an item and click <span style="color:var(--green)">add</span> to create an item node for it. Click <span style="color:var(--red)">remove</span> next to an existing node to remove it. These changes won't be saved until you submit the form.`,
  ],
  ITEM_SPELL_PROPERTIES: [
    `${padStringToLength79(`Item Spell Properties`)}`,
    `Each spell has a help file describing its effects (e.g. HELP BLESS)`,
    `<span style="color:var(--red)">Level:</span> higher can mean stronger effect, more damage, longer duration, etc.`,
    `<span style="color:var(--red)">Charges:</span> how many times the item can be used before it disappears`,
  ],
  ITEM_TYPE: [
    `This feature is still in development.`,
    `${padStringToLength79(
      `Item Type, Armor, Potion, Scroll, Token, Treasure, Wand, Weapon, Fishing Rod`
    )}`,
    `An item's type determines how that item can be used.`,
    `<span style="color:var(--red)">Armor:</span> Armor can be worn to boost stats on a user or mob.`,
    `<span style="color:var(--red)">Gold:</span> When you GET this item, it disappears and increases your gold.`,
    `<span style="color:var(--red)">Key:</span> A key will open a locked door or container.`,
    `<span style="color:var(--red)">None:</span> This item has no special traits, and just enhances the style of the zone.`,
    `<span style="color:var(--red)">Potion:</span> You can DRINK a potion to consume it and cast its spell on yourself.`,
    `<span style="color:var(--red)">Scroll:</span> RECITE a scroll to consume it and cast its spell on your target.`,
    `<span style="color:var(--red)">Token:</span> Some quests and competitions ask you to collect certain token items.`,
    `<span style="color:var(--red)">Treasure:</span> This item sells at a high price, and has no other use.`,
    `<span style="color:var(--red)">Wand:</span> USE a wand to cast its spell on your target. When out of charges, it disappears.`,
    `<span style="color:var(--red)">Weapon:</span> No one can unlock this door unless this item is in their inventory.`,
    `<span style="color:var(--red)">Fishing Rod:</span> Use it to go fishing!`,
  ],
  ITEM_TAG: [
    `${padStringToLength79(`Item Tag, Fixture, Food, Lamp, Temporary`)}`,
    `<span style="color:var(--red)">Cleric:</span> Clerics can use or equip it.`,
    `<span style="color:var(--red)">Mage:</span> Mages can use or equip it.`,
    `<span style="color:var(--red)">Rogue:</span> Rogues can use or equip it.`,
    `<span style="color:var(--red)">Warrior:</span> Warriors can use or equip it.`,
    `<span style="color:var(--red)">Dark:</span> Dark aura players can use or equip it.`,
    `<span style="color:var(--red)">Neutral:</span> Neutral aura players can use or equip it.`,
    `<span style="color:var(--red)">Light:</span> Light aura players can use or equip it.`,
    `<span style="color:var(--red)">Food:</span> It can be eaten and may hold a spell.`,
    `<span style="color:var(--red)">Lamp:</span> It lights up a dark room, showing players, mobs, and items.`,
    `<span style="color:var(--red)">Hidden:</span> It's not visible until you search.`,
    `<span style="color:var(--red)">Fixture:</span> The object cannot be taken or moved (e.g. a large wardrobe).`,
    `<span style="color:var(--red)">Quest:</span> It is needed for a quest.`,
    `<span style="color:var(--red)">Temporary:</span> The item is erased from inventory when you log out.`,
    `<span style="color:var(--red)">Container:</span> This item can spawn or hold other items inside.`,
  ],
  JOB: [
    `This feature is still in development.`,
    `${padStringToLength79(`Job`)}`,
    `A character or mob's job defines the abilities available to them at their level.`,
    `<span style="color:var(--red)">Cleric:</span> Learns spells for healing and protection, and some for damaging foes.`,
    `<span style="color:var(--red)">Mage:</span> Learns spells for damaging foes, and some utility spells..`,
    `<span style="color:var(--red)">Rogue:</span> Sneaks, steals, and backstabs foes for big damage.`,
    `<span style="color:var(--red)">Warrior:</span> Hits hard, blocks foes, and soaks up damage.`,
  ],
  KEYWORDS: [
    `${padStringToLength79(`Keywords`)}`,
    `Keywords help users target things (items, mobs) in Restoria with commands and spells. Each keyword is a single word (usually a noun) describing an item or mob. Each key word should probably appear somehow in the item or mob's description, and if it has a proper name (e.g. Greg), that name must be one of the keywords.`,
  ],
  LIGHT_WEAPON: [
    `This feature is still in development.`,
    `${padStringToLength79(`Light Weapon`)}`,
  ],
  MOB: [
    `This feature is still in development.`,
    `${padStringToLength79(`MOB, MONSTER, NPC`)}`,
    `Mob stands for "Mobile Object", (an old gaming term for anything that moves around in a game, usually a monster or NPC). The first games with mobs appeared in the late 1970's. CREATE MOB in your zone to bring it to life; give your readers monsters, peaceful creatures, and NPCs to interact with and even battle. A mob can have userful information, a quest, and equipment and treasure for a user to win, buy, or loot.`,
  ],
  MOB_NODE: [
    `${padStringToLength79(`Mob Node`)}`,
    `A mob node spawns a specific mob into the room when the zone is spawned. On the EDIT ROOM form, Choose a mob and click <span style="color:var(--green)">add</span> to create an mob node for it. Click <span style="color:var(--red)">remove</span> next to an existing node to remove it. These changes won't be saved until you click "Update Room".`,
  ],
  MOUNT: [
    `This feature is still in development.`,
    `${padStringToLength79(`MOUNT`)}`,
    `A mount is a mob that a user can ride around, usually increasing their movement, stamina, and speed outdoors. Use the MOUNT command to (for example) MOUNT HORSE before a long journey.`,
  ],
  MOVE: [
    `${padStringToLength79(`Move`)}`,
    `There is no MOVE command in Restoria. Instead, type the direction you want to move:`,
    `NORTH, EAST, SOUTH, WEST, UP, or DOWN.`,
  ],
  NAME: [
    `${padStringToLength79(`Name`)}`,
    `A name is a phrase (not a full sentence) that shows in interactions with a user, item, or mob. For example, the name "Greg, the Blacksmith" will show up when you hug that mob ("You hug Greg, the Blacksmith."), or enter combat with him ("Greg, the Blacksmith swings his hammer at you!"). The name of a room is displayed before its description when you enter or LOOK at it, and also on the list of exits in its neighbouring rooms. Some examples of names:`,
    `Items: "a blue potion", "Sting, the silver dagger", "a leather hat"`,
    `Mobs: "a goblin", "the gate guard", "Silvia, the white mage"`,
    `Rooms: "a shady garden", "the castle kitchen", "Bernie's Burger Shack"`,
  ],
  PASSWORD: [
    `This feature is still in development.`,
    `${padStringToLength79(`PASSWORD`)}`,
    `A password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number."`,
  ],
  PRONOUNS: [
    `${padStringToLength79(`Pronouns`)}`,
    `A pronoun is a part of speech we use in place of a noun or name, usually to avoid constant repetition of the name. For example, instead of say "Greg, the Blacksmith brushes Greg, the Blacksmith's teeth before Greg, the Blacksmith goes to bed," we can say "Greg brushes HIS teeth before HE goes to bed." We can use IT as a pronoun for things that have no gender (e.g. "It looks valuable."), and THEY for someone whose gender we don't know (e.g. "Someone left their sweater here. I hope they come back to find it.").`,
  ],
  QUIT: [
    `${padStringToLength79(`QUIT`)}`,
    `Use the QUIT command on its own to leave the game and return your character to world recall, The Snails statue in Restoria City.`,
  ],
  RANGED_WEAPON: [
    `This feature is still in development.`,
    `${padStringToLength79(`Ranged Weapon`)}`,
    `Weilding a ranged weapon allows you to deal combat damage from any row of your group formation.`,
  ],
  REACH_WEAPON: [
    `This feature is still in development.`,
    `${padStringToLength79(`Reach Weapon`)}`,
    `Weilding a weapon with reach allows you to deal combat damage from the front or middle row of your group formation.`,
  ],
  RECALL: [
    `${padStringToLength79(`RECALL`)}`,
    `User the RECALL command to return to safety at The Snails statue, the centre of Restoria City.`,
  ],
  RULES: [
    `${padStringToLength79(`RULES`)}`,
    `We protect the safety, dignity, and fun of Restoria users by removing players who abuse others. Everything we say and do in Restoria is logged, and if you are found to be intentionally bothering anyone else in the game, your account may be deleted without warning. In this case, your writing, character experience, equipment & items, and everything else associated with your account would be permanently removed (another good reason why everyone should keep a backup of all their writing, e.g. on Google Drive). If you don't have good intentions towards all other players at all times, stop playing Restoria until you do.`,
  ],
  SAY: [
    `${padStringToLength79(`SAY`)}`,
    `User the SAY command to communicate with users in the same room.`,
  ],
  SHOUT: [
    `${padStringToLength79(`SHOUT`)}`,
    `User the SHOUT command to communicate with users in the same zone.`,
  ],
  SPELL: [
    `This feature is still in development.`,
    `${padStringToLength79(`Spell`)}`,
    `A magic spell has a damaging, healing, or some other effect on its target. Users and mobs learn spells if they belong to the mage or cleric job. Certain items like scrolls, potions, and wands carry spells that any user can cast by using the item. Many spells have a duration, after which the spell and its effects disappear. It is said amongst the wise that the creation of all Restoria began with a single spell.`,
  ],
  STATS: [
    `This feature is still in development.`,
    `${padStringToLength79(
      `STATS, HP, MP, MV, STR, DEX, CON, INT, WIS, SPIRIT`
    )}`,
    `<span style="color:var(--red)">Health Points (HP):</span> show how much damage can be taken before death`,
    `<span style="color:var(--red)">Magic Points (MP):</span> are used to cast spells`,
    `<span style="color:var(--red)">Move Points (MV):</span> are spent moving between rooms`,
    `<span style="color:var(--red)">Strength (STR):</span> affects melee combat damage, skill success, inventory capacity`,
    `<span style="color:var(--red)">Dexterity (DEX):</span> affects melee combat damage, skill success, dodging`,
    `<span style="color:var(--red)">Constitution (CON):</span> affects max HP, resistance, regeneration`,
    `<span style="color:var(--red)">Intelligence (INT):</span> affects max MP and damage, duration, and success of mage spells`,
    `<span style="color:var(--red)">Wisdom (WIS):</span> affects max MP and healing, duration, and succes of cleric spells `,
    `<span style="color:var(--red)">Spirit:</span> shows alignment of spirit to the sun or moon, affecting many spells and effects. Spirit will move away from the alignment of defeated foes (e.g. become more moon-aligned by defeating sun-aligned foes).`,
  ],
  SUGGEST: [
    `${padStringToLength79(`SUGGEST`)}`,
    `Leave a suggestion for an author who has chosen you as their EDITOR. A quality suggestion is specific, encouraging, and as brief as possible.`,
  ],
  SUGGESTIONS: [
    `${padStringToLength79(`SUGGESTIONS`)}`,
    `View a list of suggestions left by your EDITOR in the unpublished zone you're in. Mark a suggestion <span style="color:var(--green_light)">completed</span> to show you have made the change. If you don't agree with a suggestion, you can mark it <span style="color:var(--red)">declined</span> without making the change. C`,
  ],
  TELEPATH: [
    `${padStringToLength79(`TELEPATH`)}`,
    `Communicate with a single user regardless of location, e.g. TEL RALU hi how are you?`,
  ],
  TWO_HAND_WEAPON: [
    `This feature is still in development.`,
    `${padStringToLength79(`Two-hand Weapon`)}`,
    `A two-hand weapon takes up both hands, and in exchange it usually does more damage and has more effective affixes.`,
  ],
  UNIQUE_MOB: [
    `This feature is still in development.`,
    `${padStringToLength79(`Unique Mob`)}`,
    `A Unique mob can only exist in one place at one time. It is different from a mob like "a goblin", where there could be any number of them in a zone or in the world. Use this for special mobs with an identity, especially those with a name (e.g. Greg, the Blacksmith), where it wouldn't make sense for there to be more than one in the world.`,
  ],
  WEAPON: [
    `This feature is still in development.`,
    `${padStringToLength79(`Weapon Properties`)}`,
    `<span style="color:var(--red)">Damage:</span>The first number determines how many dice are rolled. The second is how many sides per die (ie the max roll per die). e.g. 3d4 Bludgeoning deals between 3-12 bludgeoning damage per hit.`,
    `<span style="color:var(--red)">Finesse:</span> uses dexterity to determine damage bonus`,
    `<span style="color:var(--red)">Light:</span> can be thrown or wielded in off-hand`,
    `<span style="color:var(--red)">Reach:</span> can hit from middle row of formation`,
    `<span style="color:var(--red)">Ranged:</span> can hit from back row of formation`,
    `<span style="color:var(--red)">Twohand:</span> can't be paired with a shield or off-hand`,
  ],
  WHO: [
    `This feature is still in development.`,
    `${padStringToLength79(`WHO`)}`,
    `Typing WHO shows you all the authors currently logged into Restoria, with some basic info about each. You can contact these users using TELEPATH.`,
  ],
};

export default HELP;
