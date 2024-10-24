import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt';

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
	}
}>();

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/signup', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
	const body = await c.req.json();
	try {
		const user = await prisma.user.create({
			//@ts-ignore
			data: {
				email: body.email,
				name: body.name,
				password: body.password
			}
		});
	
		const jwt = await sign({id: user.id}, "mySecret");

		return c.json({jwt})
	} catch(e) {
		return c.status(403);
	}
})

app.post('/api/v1/signin', async(c) => {ls

	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	const body= await c.req.json();

	const user= prisma.user.findUnique({
		where:{
			email: body.email,
			password: body.password
		}
	})

	if(!user){
		c.status(403);
		return c.json({error: "User not found"})
	}
//@ts-ignore
	const jwt=  await sign({id: user.id}, "mySecret")
	return c.json({jwt})
})

app.get('/api/v1/blog/:id', (c) => {
	const id = c.req.param('id')
	console.log(id);
	return c.text('get blog route')
})

app.post('/api/v1/blog', (c) => {

	return c.text('signin route')
})

app.put('/api/v1/blog', (c) => {
	return c.text('signin route')
})

export default app
