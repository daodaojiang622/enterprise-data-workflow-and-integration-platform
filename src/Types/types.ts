export interface Event {
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

export interface Task {
    id: string,
    name: string,
    event: string,
    dueDate: string,
    description: string,
    comment: string,
    approver1: string,
    approver2: string,
    approver3: string,
    assigner: string,
    assignee: string,
    isCompleted: boolean,
    isApprovedByApprover1: boolean,
    isApprovedByApprover2: boolean,
    isApprovedByApprover3: boolean,
};

export interface Donor {
    donorId: string;
    pmm?: string | null;
    smm?: string | null;
    vmm?: string | null;
    exclude?: string | null;
    deceased?: string | null;
    first_name?: string | null;
    nick_name?: string | null;
    last_name?: string | null;
    organization_name?: string | null;
    total_donations?: number | null;
    total_pledge?: number | null;
    largest_gift?: number | null;
    largest_gift_appeal?: string | null;
    first_gift_date?: number | null;
    last_gift_date?: number | null;
    last_gift_amount?: number | null;
    last_gift_request?: number | null;
    last_gift_appeal?: string | null;
    address_line1?: string | null;
    address_line2?: string | null;
    city?: string | null;
    contact_phone_type?: string | null;
    phone_restrictions?: string | null;
    email_restrictions?: string | null;
    communication_restrictions?: string | null;
    subscription_events_in_person?: string | null;
    subscription_events_magazine?: string | null;
    communication_preference?: string | null;
    cancer_type?: string | null;
};


export interface List {
    listId: string;
    generateDate: string;
    eventName: string;
    description?: string | null;
};