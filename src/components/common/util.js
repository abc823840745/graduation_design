export const showTitle = (item, vm) => {
  return vm.$config.useI18n ? vm.$t(item.name) : (item.meta && item.meta.title) || item.name;
};

/**
 * 秒数转换成时分秒或时分
 * @param {number} value // 秒数
 */
export function formatSeconds(value) {
  let secondTime = parseInt(value, 10); // 秒
  let minuteTime = 0; // 分
  let hourTime = 0; // 小时
  if (secondTime > 60) {
    // 如果秒数大于60，将秒数转换成整数
    // 获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt((secondTime / 60).toString(), 10);
    // 获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt((secondTime % 60).toString(), 10);
    // 如果分钟大于60，将分钟转换成小时
    if (minuteTime > 60) {
      // 获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt((minuteTime / 60).toString(), 10);
      // 获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = parseInt((minuteTime % 60).toString(), 10);
    }
  }
  return `${hourTime < 10 ? '0' + hourTime : hourTime}:
  ${minuteTime < 10 ? '0' + minuteTime : minuteTime}:
  ${secondTime < 10 ? '0' + secondTime : secondTime}`;
}
