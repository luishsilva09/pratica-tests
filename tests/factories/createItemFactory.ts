import { faker } from '@faker-js/faker';


export async function creteItem(){
    return {
        title:faker.lorem.words(3),
        url:faker.internet.url(),
        description:faker.lorem.paragraph(1),
        amount:Number(faker.finance.amount(0,1000,0))
    }
}