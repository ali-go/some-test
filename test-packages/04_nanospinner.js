import { createSpinner } from "nanospinner";
const spinner = createSpinner("Run test").start();

setTimeout(() => {
	console.log('success')
  spinner.success();
}, 1000);
setTimeout(() => {
	console.log('error')
  spinner.error();
}, 2000);
setTimeout(() => {
	console.log('spin')
  spinner.spin();
}, 3000);
setTimeout(() => {
	console.log('warn')
  spinner.warn();
}, 4000);
setTimeout(() => {
	console.log('update')
  spinner.update();
}, 5000);
setTimeout(() => {
	console.log('reset')
  spinner.reset();
}, 6000);
setTimeout(() => {
	console.log('clear')
  spinner.clear();
}, 7000);

