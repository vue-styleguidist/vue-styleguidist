Each example has its own state that you can access at the `state` variable and change with the `setState` function. Default state is `{}`.

    let isOpen = false;

    <div>
      <button @click.prevent="isOpen = true">Open</button>
      <Modal :showModal="isOpen">
        <h1>Hallo!</h1>
        <button  @click.prevent="isOpen = false">Close</button>
      </Modal>
    </div>

If you want to set the default state you can do something like that:

    let count = 1;

    <button @click.prevent="count++">{{ count }}</button>

You can also develop more complex examples, instantiating Vue

    const timeCountdown = 5;

    new Vue({
      data(){
        return {
          showModal: false,
          countdown: timeCountdown
        }
      },
      watch:{
          showModal(value) {
            if (value) {
              var cycle = setInterval(()=>{
                this.countdown--;
                if (this.countdown === 0) {
                  this.showModal = false;
                  this.countdown = timeCountdown;
                  clearInterval(cycle);
                }
              },1000);
            }
          },
      },
      template: `
        <div>
          <button @click.prevent="showModal = true">Open Modal</button>
          <Modal :showModal="showModal">
            <h1>Countdown to close mode {{ countdown }}</h1>
          </Modal>
        </div>
      `
    })
