import app from '../src/app';
import supertest from 'supertest';
import { prisma } from '../src/database';
import * as itensFactory from './factories/createItemFactory';
import { TItemData}from '../src/types/ItemsTypes'

beforeEach(async ()=>{
  await prisma.$executeRaw`TRUNCATE TABLE items`
} )

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const itemData = await itensFactory.creteItem();
    const result = await supertest(app).post('/items').send(itemData);
    const createdItem = await prisma.items.findUnique({where:{title:itemData.title}})

    expect(result.status ).toBe(201);
    expect(createdItem).not.toBeNull();
  });


  it('Deve retornar 409, ao tentar cadastrar um item que exista',async ()=>{
    const itemData = await itensFactory.creteItem();
    await supertest(app).post('/items').send(itemData);
    const createItem = await supertest(app).post('/items').send(itemData);

    expect(createItem.status).toBe(409)

  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array',async ()=>{
    const result = await supertest(app).get('/items');

    expect(result.status).toBe(200)
    expect(result.body).toBeInstanceOf(Array)
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado',async ()=>{
    const itemData = await itensFactory.creteItem();
    await supertest(app).post('/items').send(itemData);
    const findItem = await prisma.items.findUnique({where:{title:itemData.title}})

    const getItem = await supertest(app).get(`/items/${findItem.id}`)

    const expected: TItemData = itemData
    expect(getItem.body).toMatchObject(expected)
  });

  it('Deve retornar status 404 caso não exista um item com esse id',async ()=>{
    const getItem = await supertest(app).get(`/items/28`)
    expect(getItem.status).toBe(404)
  });
  
});

afterAll(async() => {
  await prisma.$disconnect();
});