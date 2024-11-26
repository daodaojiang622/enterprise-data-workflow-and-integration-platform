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