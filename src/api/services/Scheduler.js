import kue from 'kue-scheduler';

export class Scheduler{
    startJob(config){
        var options = {
            prefix: 'w',
            skipConfig: false,
            redis: {
                port: 6379,
                host: '127.0.0.1',
                db: 2
            },
            restore: true
        };
        var Queue = kue.createQueue(options);
        Queue.clear((error,response) => {
            if(error)
                console.log(error.toString());
            if(response)
                console.log(response.toString());
        });
        Queue.on('already scheduled', function (job) {
            console.log('job already scheduled' + job.id);
        });

//create a job instance
        var job = Queue
            .createJob('every-3', {
                to: 'any'
            })
            .attempts(3)
            .backoff({
                delay: 60000,
                type: 'fixed'
            })
            .priority('normal');

//schedule it to run every 2 seconds
        Queue.schedule('5 second', job);
        //Queue.every('5 second', job);

//somewhere process your scheduled jobs
        Queue.process('every-3', function(job, done) {
            console.log("Running every-3");
            done();
        });

    }
    backoff(){

    }
}