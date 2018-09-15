export default function ({ store, redirect }) {
  if (!store.state.auth.wif) {
    return redirect({name: 'login'})
  }
}
