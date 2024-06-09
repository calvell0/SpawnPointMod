const time = Date.now();
for (let i = 0; i < 1_000_000_000; i++) {

}

const final_time = Date.now() - time;


console.log("Total time: ", final_time, "ms");