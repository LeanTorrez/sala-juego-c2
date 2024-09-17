export interface IMazo{
    success: boolean;
    deck_id: string;
    cards: ICarta[];
    remaining: number;
}

export interface ICarta{
    code:string;
    image:string;
    images:Iimage;
    value:string;
    suit:string;
}

interface Iimage{
    svg:string;
    png:string;
}
