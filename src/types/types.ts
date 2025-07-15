

export type Booking ={
    id:string
    name:string;
    phNo:string;
    checkIn:Date;
    checkOut:Date;
    through:string;
    city:string;
    property:string;
    handler:string;
    advance:number;
    total:number;
    status:string;
}

export type Property = {
    PropertyID: string;
    Name: string;
    City: string;
};