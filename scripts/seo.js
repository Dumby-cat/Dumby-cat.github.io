'use strict';

// NexT renders page.noindex as a robots meta tag, including generated tag archives.
hexo.extend.filter.register('template_locals', function(locals) {
  if (locals.page && locals.page.tag) {
    locals.page.noindex = true;
  }
  return locals;
});
