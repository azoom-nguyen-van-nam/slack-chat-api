import express from 'express'
import { CronJob } from 'cron'
import { WebClient } from '@slack/web-api'
const app = express()

const slackUserToken = process.env.SLACK_USER_TOKEN
const slackClient = new WebClient(slackUserToken)
const channelId = process.env.CHANNEL_ID
const musicBotId = process.env.BOT_ID
const videoLink = ''

CronJob.from({
  cronTime: '59 19 16 * * *',
  onTick: async () => {
    const threadId = await getOrderMusicThread()
    await slackClient.chat.postMessage({
      channel: channelId,
      thread_ts: threadId,
      text: `${videoLink}`,
      unfurl_links: false,
      unfurl_media: false
    })
    console.log('DONE !')
  },
  start: true,
  timeZone: 'Asia/Ho_Chi_Minh'
})

app.listen(6626, (err) => {
  if (err) {
    return console.error(err)
  }
  console.log(`Listening on port 6626`)
})

const getOrderMusicThread = async () => {
  const lastMessage = await slackClient.conversations.history({
    channel: channelId,
    limit: 1
  })

  if (lastMessage.messages[0]?.bot_id !== musicBotId) {
    return getOrderMusicThread()
  }

  return lastMessage.messages[0].thread_ts || lastMessage.messages[0].ts
}

export default app
