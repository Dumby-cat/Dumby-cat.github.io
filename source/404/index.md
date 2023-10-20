---
title: 404 Not Found
date: 2023-10-20 19:10:32
type: 404
---

## 将在 <span id="timeout">5</span> 秒后返回首页。

*[点这里](/) 直接返回首页。*

<script>
let countTime = 5;

function count() {

  document.getElementById('timeout').textContent = countTime;
  countTime -= 1;
  if(countTime === 0){
    location.href = '/';
  }
  setTimeout(() => {
    count();
  }, 1000);
}

count();
</script>