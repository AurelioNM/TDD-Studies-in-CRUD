const axios = require('axios')
const crypto = require('crypto')
const postsService = require('../service/postsService')

const generate = function () {
    return crypto.randomBytes(20).toString('hex')
}

const request = function (url, method, data) {
    return axios({ url, method, data, validateStatus: false })
}

test('Should get posts', async function () {
    //given - dado que
    const post1 = await postsService.savePost({ title: generate(), content: generate() })
    const post2 = await postsService.savePost({ title: generate(), content: generate() })
    const post3 = await postsService.savePost({ title: generate(), content: generate() })
    //when - quando acontecer
    const response = await request('http://localhost:3000/posts', 'get')
    
    expect(response.status).toBe(200)
    
    const posts = response.data //esse .data pega apenas os dados do banco
    //then - entao
    expect(posts).toHaveLength(3)
    await postsService.deletePost(post1.id)
    await postsService.deletePost(post2.id)
    await postsService.deletePost(post3.id)
})

test('Should save a post', async function () {
    //given - dado que 
    const data = { title: generate(), content: generate() }
    //when - quando acontecer
    const response = await request('http://localhost:3000/posts', 'post', data)
    
    expect(response.status).toBe(201)

    const post = response.data //esse .data pega apenas os dados do banco
    //then - entao
    expect(post.title).toBe(data.title)
    expect(post.content).toBe(data.content)
    await postsService.deletePost(post.id)
})

test('Should not save a post', async function () {
    const data = { title: generate(), content: generate() }
    
    const response1 = await request('http://localhost:3000/posts', 'post', data)
    const response2 = await request('http://localhost:3000/posts', 'post', data)
 
    expect(response2.status).toBe(409)

    const post = response1.data 
    
    await postsService.deletePost(post.id)
})

test('Should update a post', async function () {
    //criando post
    const post = await postsService.savePost({ title: generate(), content: generate() })
    //alterei esse post em MEMÓRIA
    post.title = generate() 
    post.content = generate()
    //chamando o serviço de alteração
    const response = await request(`http://localhost:3000/posts/${post.id}`, 'put', post)
    
    expect(response.status).toBe(204)

    //pedindo o post para o banco de dados
    const updatedPost = await postsService.getPost(post.id)
    //conferindo se o serviço funciona
    expect(updatedPost.title).toBe(post.title)
    expect(updatedPost.content).toBe(post.content)
    //fazendo delete
    await postsService.deletePost(post.id)
})

test('Should not update a post', async function () {
    const post = {
        id: 1
    }
    const response = await request(`http://localhost:3000/posts/${post.id}`, 'put', post)
    
    expect(response.status).toBe(404)
})

test('Should delete a post', async function () {
    const post = await postsService.savePost({ title: generate(), content: generate() })
    const response = await request(`http://localhost:3000/posts/${post.id}`, 'delete')
    
    expect(response.status).toBe(204)

    const posts = await postsService.getPosts()
    expect(posts).toHaveLength(0)
})