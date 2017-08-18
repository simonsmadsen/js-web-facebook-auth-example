const web = require('js-web')
const db = web.storage.mysql

/**
 * Tables!
*/
const users = db.table('users')

/**
 * Injections
*/
const injections = [
  web.inject.facebookAuth('/facebook-login','fb-login')
]

/**
 * Routes
*/
web.htmlRoute('/','html/index.html', async (input,session) => {
  const user_id = session.get('user_id')
  return {
    user_id: user_id,
    user: user_id ? await users.find({id:user_id}) : null
  }
},injections)

web.route('/logout', async (input,session) => {
  session.set('user_id',null)
  return web.back()
})

web.postRoute('/facebook-login', async (input,session) => {
  const foundUser = await users.find({facebook:input.userID})
  if(!foundUser){
    const userInfo = await
      web.social.getFacebookFields(input.accessToken)

    const user_id = await users.create({
      facebook:input.userID,
      name:userInfo.name
    })

    await web.social.getFacebookImage(input.accessToken,'assets/'+user_id+'.jpg')
    session.set('user_id',user_id)
  }else{
    session.set('user_id',foundUser.id)
  }

  return web.back()
})


web.start()
