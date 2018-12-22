import Vue from 'vue'
import axios from 'axios'
import steem from 'steem'
import Raven from 'raven-js'

import { Signature, PrivateKey, hash } from 'steem/lib/auth/ecc'

import config from '@/config'
import { slug } from '~/utils'
import { preparePost, jsonParseSafe } from '~/utils/'


export async function comment(parentAuthor, parentPermlink, author, permlink, title, body, meta) {
  try {
    let url = `${config.BASE_URL}@${author}/${permlink}`
    if (!body.includes('div class="dtrip-banner"')) {
      body += `\n\n<div class="dtrip-banner">Published by <a href="${url}">DTrip</a> travel app.</div>`
    }

    let res = await Vue.SteemConnect().comment(
        parentAuthor,
        parentPermlink,
        author,
        slug(permlink),
        title,
        body,
        prepare_json_metadata(meta)
    )

    return res.result
  } catch (e) {
    Raven.captureMessage(e)
    console.log(e)
    throw e
  }

  //try {
  //  let res = await steem.broadcast.commentAsync(
  //      wif,
  //      parentAuthor,
  //      parentPermlink,
  //      author,
  //      slug(permlink),
  //      prepare_json_metadata(meta)
  //  )

  //  return res
  //} catch (e) {
  //  Raven.captureMessage(e)
  //  console.log(e)
  //  throw e
  //}
}


export async function getAccount(name) {
  let [account] = await steem.api.getAccountsAsync([name])

  if (!account) return

  account.meta = jsonParseSafe(account.json_metadata)
  
  // Apps data
  if (!('profile' in account.meta)) account.meta.profile = {}
  if (!('dtripProfile' in account.meta)) account.meta.dtripProfile = {}

  return account
}


export async function getContent(author, permlink) {
  let post = await steem.api.getContentAsync(author, permlink)

  return preparePost(post)
}


export async function createUniqPermlink(author, title) {
  // Возвращает уникальный пермлинк для поста
  let permlink = slug(title)

  let isExists = await steem.api.getContentAsync(author, permlink)

  if (isExists.id !== 0) {
    const timeStr = new Date()
      .toISOString()
      .replace(/[^a-zA-Z0-9]+/g, "")
      .toLowerCase()

    permlink = `${permlink}-${timeStr}`
  }

  return permlink
}



export function prepare_json_metadata (m) {
  let meta = m

  let app_tag = config.tag_for_post
  meta.app = config.app
	meta.community = app_tag

  if (meta.tags === undefined) {
    meta.tags = [app_tag]
  } else if (!meta.tags.includes(app_tag)) {
    meta.tags.unshift(app_tag)
  }

  return meta
}

export async function uploadImage (file, auth) {
  // IF steemconnect mode we use busy.org for images host
  if (true) { // now only steemconnect
    const formData = new FormData()
    formData.append('file', file)

    const res = await axios.post('https://ipfs.busy.org/upload',
      formData, {headers: {'content-type': 'multipart/form-data'}}
    )
    return res.data.url
  }

  const username = auth.account.name
  const d = PrivateKey.fromWif(auth.wif)

  if (!username) {
    throw new Error('Please logged in first.')
  }

  if (!d) {
    throw new Error('Login with your posting key')
  }

  if (!file && !dataUrl) {
    console.error('uploadImage required: file or dataUrl')
  }

  let data, dataBs64

  if (file) {
    const reader = new FileReader()
    data = await new Promise(resolve => {
      reader.addEventListener('load', () => {
        const result = new Buffer(reader.result, 'binary')
        resolve(result)
      })
      reader.readAsBinaryString(file)
    })
  } else {
    // recover from preview
    const commaIdx = dataUrl.indexOf(',')
    dataBs64 = dataUrl.substring(commaIdx + 1)
    data = new Buffer(dataBs64, 'base64')
  }

  // The challenge needs to be prefixed with a constant (both on the server and checked on the client) to make sure the server can't easily make the client sign a transaction doing something else.
  const prefix = new Buffer('ImageSigningChallenge')
  const bufSha = hash.sha256(Buffer.concat([prefix, data]))

  const formData = new FormData()

  if(file) {
    formData.append('file', file)
  } else {
    // formData.append('file', file, filename) <- Failed to add filename=xxx to Content-Disposition
    // Can't easily make this look like a file so this relies on the server supporting: filename and filebinary
    formData.append('filename', filename)
    formData.append('filebase64', dataBs64)
  }

  const sig = Signature.signBufferSha256(bufSha, d)
  const upload_url = 'https://steemitimages.com' // TODO заменять для стима/голоса
  const postUrl = `${upload_url}/${username}/${sig.toHex()}`

  const res = await axios.post(postUrl, formData, {headers: {'content-type': 'multipart/form-data'}})

  return res.data.url
}


export default steem;
