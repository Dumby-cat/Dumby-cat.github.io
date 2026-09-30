'use strict';

const { synchronize } = require('../tools/post-times.cjs');

// Run before Hexo renders posts (priority 10), including regeneration in hexo server.
hexo.extend.filter.register('before_generate', async function() {
  const plans = synchronize(this.base_dir, this.config.timezone || 'Asia/Shanghai');
  const posts = this.model('Post');
  for (const plan of plans) {
    const post = posts.findOne({ source: plan.key });
    if (!post) continue; // Drafts may not be loaded in the current preview.
    if (post.date.valueOf() === plan.date.getTime() && post.updated?.valueOf() === plan.updated.getTime() && plan.raw === plan.next) continue;
    // Update through Warehouse's schema so date values are cast exactly once.
    const fields = { date: plan.date, updated: plan.updated };
    if (plan.raw !== plan.next) fields.raw = plan.next;
    await post.update(fields);
  }
  const changed = plans.filter(p => p.raw !== p.next).length;
  if (changed) this.log.info(`Updated date metadata in ${changed} article(s).`);
}, 5);
