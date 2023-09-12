<script>
    export let visible = false;
    export let closeModal;
  </script>
  
  {#if visible}
    <div class="modal-overlay" on:click={closeModal}>
      <div class="modal-content" on:click={(e) => e.stopPropagation()}>
        <!-- Insert your modal content here -->
        <slot></slot>
      </div>
    </div>
  {/if}
  
  <style>
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
  
    .modal-content {
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      max-width: 80%;
      text-align: center;
    }
  </style>