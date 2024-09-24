export interface Pais{
    flags:flag;
    capital:string[];
    name:Name;
    subregion:string;
    translations: Translation;
}

interface flag{
    alt:string;
    png:string;
    svg:string
}

interface Name{
    common:string;
}

interface Translation{
    spa: Spa;
}

interface Spa{
    official:string;
    common:string
}