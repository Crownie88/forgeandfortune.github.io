"use strict";

const EventTypes = Object.freeze({DUNGEON:"DUNGEON",});

const EventManager = {
    events : [],
    eventNum : 0,
    createSave() {
        const save = [];
        this.events.forEach(e => {
            save.push(e.createSave());
        })
        return save;
    },
    loadSave(save) {
        save.forEach(e => {
            const event = new Event(e.type);
            event.loadSave(e);
            event.id = this.eventNum.toString();
            this.eventNum += 1;
            this.events.push(event);
        });
    },
    addEvent(event) {
        event.id = this.eventNum.toString();
        this.eventNum += 1;
        this.events.push(event);
        refreshEvents();
    },
    removeEvent(eventID) {
        const event = this.idToEvent(eventID);
        if (event.type === EventTypes.DUNGEON) ResourceManager.addDungeonDrops(event.reward);
        else WorkerManager.gainWorker(event.type)
        this.events = this.events.filter(event => !(event.id === eventID));
        refreshEvents();
    },
    idToEvent(eventID) {
        return this.events.find(event => event.id === eventID);
    },
    addEventDungeon(reward,time,floor) {
        const event = new Event(EventTypes.DUNGEON);
        event.reward = reward;
        event.time = time;
        event.floor = floor;
        EventManager.addEvent(event)
    },
    addOnceEvent(eventID) {
        const event = new Event(eventID);
        EventManager.addEvent(event)
    },
    hasEvents() {
        return this.events.length > 0
    }
};

class Event {
    constructor(type) {
        this.type = type;
        if (this.type === EventTypes.DUNGEON) this.title = "Dungeon Reward";
        this.image = '<img src="images/DungeonIcons/event.png" alt="Event">';
    }
    createSave() {
        const save = {};
        save.type = this.type;
        save.reward = this.reward;
        save.time = this.time;
        save.floor = this.floor;
        return save;
    }
    loadSave(save) {
        this.type = save.type;
        this.reward = save.reward;
        this.time = save.time;
        this.floor = save.floor;
    }
    getText() {
        const d = $("<div/>").addClass("dungeonEventText")
        const d1 = $("<div/>").addClass("dungeonEventTimeHeading").html("Total Time:");
        const d1a = $("<div/>").addClass("dungeonEventTime").html(msToTime(this.time));
        const d2 = $("<div/>").addClass("dungeonEventFloorHeading").html("Floor Reached:");
        const d2a = $("<div/>").addClass("dungeonEventFloor").html("Floor " + this.floor);
        d1.append(d1a);
        d2.append(d2a);
        return d.append(d1,d2);
    }
};

const $eventList = $("#eventList");
const $eventContent = $("#eventContent");
const $eventTab = $("#eventTab");

function refreshEvents() {
    $eventList.empty();
    EventManager.events.forEach(event => {
        const d1 = $("<div/>").addClass("eventList").attr("eventID",event.id).html(`${event.image} ${event.title}`);
        $eventList.append(d1);
    });
    $eventContent.empty();
    if (EventManager.hasEvents()) $eventTab.addClass("hasEvent");
    else {
        $eventTab.removeClass("hasEvent");
        const d1 = $("<div/>").addClass("events-placeholder-details").html("You have no mail to collect at the moment."); 
        $eventList.append(d1);
    }
}

function dungeonDrops(event) {
    //returns a bunch of divs for the rewards
    const d = $("<div/>").addClass("rewardDiv");
    event.reward.forEach(reward => {
        const d1 = $("<div/>").addClass("rewardCard tooltip").attr("data-tooltip",ResourceManager.idToMaterial(reward.id).name);
        const d2 = $("<div/>").addClass("rewardImage").html(ResourceManager.idToMaterial(reward.id).img);
        const d3 = $("<div/>").addClass("rewardAmt").html(reward.amt);
        d.append(d1.append(d2,d3));
    });
    return d;
}

$(document).on('click', "div.eventList", (e) => {
    //display the text for a clicked event
    e.preventDefault();
    $("div.eventList").removeClass("highlight");
    $(e.currentTarget).addClass("highlight");
    const eventID = $(e.currentTarget).attr("eventID");
    const event = EventManager.idToEvent(eventID);
    $eventContent.empty();
    const d = $("<div/>").addClass("eventMessage").html(event.getText());
    if (event.type === EventTypes.DUNGEON) {
        const d1 = $("<div/>").addClass("eventReward").html(dungeonDrops(event));
        d.append(d1);
    }
    const d2 = $("<div/>").addClass("eventConfirm").attr("eventID",eventID).html("ACCEPT");
    d.append(d2);
    $eventContent.append(d);
});

$(document).on('click', "div.eventConfirm", (e) => {
    //gets rid of event, and adds to inventory if you need to
    e.preventDefault();
    const eventID = $(e.currentTarget).attr("eventID");
    EventManager.removeEvent(eventID);
})