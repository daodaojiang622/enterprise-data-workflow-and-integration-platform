import { create } from 'zustand'
import {httpRequest} from "./http";


export interface IEvent {
    id: string;
    title: string;
    date: string;
    owner: string;
    typeOfCancer: string;
    description: string;
    region: string;
    particularTopic: string;
    hasGeneratedList: boolean;
    listId: string;
}

export interface IBriefEvent {
    id: string;
    title: string;
}

interface StoreInterface {
    events: IEvent[];
    briefEvents: IBriefEvent[];
    setEvents: (events: IEvent[]) => void;
    reloadEvents: () => Promise<void>;
    createEvent: (event: Omit<IEvent, 'id' | 'hasGeneratedList' | 'listId'>) => Promise<void>;
    updateEvent: (event: IEvent) => Promise<void>;
    deleteEvent: (eventId: string) => Promise<void>;
}

export const useStore = create<StoreInterface>((set) => ({
    events: [],
    briefEvents: [],
    setEvents: (events) => set({ events }),
    reloadEvents: async () => {
        try {
            const response = await httpRequest.get(`/events`);
            if (response && response.data) {
                set({ events: response.data });
            }
        } catch (error) {
            console.log(`Error fetching events: ${error}`);
        }
    },
    reloadBriefEvents: async () => {
        try {
            const response = await httpRequest.get(`/events/names-ids`);
            if (response && response.data) {
                set({ briefEvents: response.data });
            }
        } catch (error) {
            console.log(`Error fetching events: ${error}`);
        }
    },
    createEvent: async (event) => {
        await httpRequest.post(`/events`, event);
    },
    updateEvent: async (event: IEvent) => {
        await httpRequest.put(`/events/${event.id}`, event);
    },
    deleteEvent: async (eventId: string) => {
        await httpRequest.delete(`/events/${eventId}`);
    }
}));
