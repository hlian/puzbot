import * as Koa from 'koa';
import * as KoaBody from 'koa-body';
import * as KoaMount from 'koa-mount';
import * as KoaStatic from 'koa-static';

import { RTMClient, WebClient } from '@slack/client';

interface Channel {
  id: string;
  is_member: boolean;
  name: string;
}

const main = async () => {
  const token = process.env.TOKEN;
  if (!token) {
    throw new Error('no TOKEN');
  }

  const port = process.env.PORT;
  if (!port) {
    throw new Error('no PORT');
  }

  const rtm = new RTMClient(token);
  rtm.start();

  const web = new WebClient(token);
  const app = new Koa();
  app.use(KoaBody());
  app.use(async ctx => {
    const body = ctx.request.body;
    if (!body) {
      ctx.status = 400;
      ctx.body = 'no body :(';
      return;
    }

    if (body.message) {
      const { channels: haystack } = ((await web.channels.list()) as any) as {
        channels: Channel[];
      };

      const channels = haystack.filter(c => c.is_member && c.name !== 'test');
      if (channels.length > 0) {
        rtm.sendMessage(body.message.substring(0, 500), channels[0].id);
        ctx.body = 'ok';
      } else {
        ctx.status = 400;
        ctx.body = 'no channels :(';
      }
    } else {
      ctx.status = 400;
      ctx.body = 'unrecognized body :(';
    }
  });
  app.listen(port);
};

main().catch(e => {
  process.stderr.write(`main: ${e}\n`);
});
