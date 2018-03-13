You can modify the code through the playground

    let isOpen = false;

    <div>
      <button @click.prevent="isOpen = true">Open</button>
      <Modal :showModal="isOpen">
        <h1 slot="head">Hallo!</h1>
        <div slot="body">
          <button  @click.prevent="isOpen = false">Close</button>
        </div>
      </Modal>
    </div>

The variables are reactive:

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
            <h1 slot="head">Title</h1>
            <div slot="body">
              Countdown to close mode {{ countdown }}
            </div>
          </Modal>
        </div>
      `
    })
