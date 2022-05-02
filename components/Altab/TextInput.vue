<template>
  <div
    class="flex flex-row p-2 space-x-2 text-white rounded md:space-x-4 md:px-4 shadow-inner-small ring-2 ring-white"
    :class="{ 'items-center': center }"
  >
    <label :for="name">
      <slot></slot>
    </label>
    <slot
      :id="name"
      name="input"
      :className="getInputClass"
      :value="value"
      :input="textInput"
      :type="type"
      :inputName="name"
      :placeholder="placeholder"
    />
  </div>
</template>

<script>
export default {
  name: 'TextInput',
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    center: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getInputClass() {
      return 'flex-1 rounded-lg placeholder-light-grey text-white bg-transparent focus:outline-none rounded-none sm:focus:bg-primary-dark sm:focus:bg-opacity-30'
    },
  },
  methods: {
    textInput(event) {
      this.$emit('input', event.target.value)
    },
  },
}
</script>
