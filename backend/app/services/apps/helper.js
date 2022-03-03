import { XApp, XAppUser } from '../../db/models'

export async function getApps () {
  const result = await XApp.findAll({ where: { active: true }, raw: true })
  return result
}

export async function getAppsByUser ({ user_id }) {
  const result = await XApp.findAll({
    include: [{
      model: XAppUser,
      where: { user_id },
      attributes: []
    }],
    where: { active: true },
    raw: true
  })
  return result
}

export async function getAppUsersByUser ({ user_id }) {
  const result = await XAppUser.findAll({
    include: [{
      model: XApp,
      where: { active: true },
      attributes: []
    }],
    where: { user_id },
    raw: true
  })
  return result
}

export async function getAppsUser ({ user_id, user_level }) {
  let apps = await getAppsByUser({ user_id })
  if (apps.length === 0) {
    const allApps = await getApps()
    apps = allApps.filter(app => user_level >= app.min_userlevel)
  }
  return apps.sort((a, b) => { return (a.sortorder - b.sortorder) })
}
