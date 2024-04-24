import { g as y, r as f, u as _, p as m } from './index-BO0RzkEx.js'; function P (r, e) { for (let t = 0; t < e.length; t++) { const s = e[t]; if (typeof s !== 'string' && !Array.isArray(s)) { for (const a in s) if (a !== 'default' && !(a in r)) { const l = Object.getOwnPropertyDescriptor(s, a); l && Object.defineProperty(r, a, l.get ? l : { enumerable: !0, get: () => s[a] }) } } } return Object.freeze(Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' })) } const g = Object.create; const n = Object.defineProperty; const b = Object.getOwnPropertyDescriptor; const v = Object.getOwnPropertyNames; const O = Object.getPrototypeOf; const w = Object.prototype.hasOwnProperty; const j = (r, e, t) => e in r ? n(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t; const L = (r, e) => { for (const t in e)n(r, t, { get: e[t], enumerable: !0 }) }; const c = (r, e, t, s) => { if (e && typeof e === 'object' || typeof e === 'function') for (const a of v(e))!w.call(r, a) && a !== t && n(r, a, { get: () => e[a], enumerable: !(s = b(e, a)) || s.enumerable }); return r }; const K = (r, e, t) => (t = r != null ? g(O(r)) : {}, c(e || !r || !r.__esModule ? n(t, 'default', { value: r, enumerable: !0 }) : t, r)); const D = r => c(n({}, '__esModule', { value: !0 }), r); const o = (r, e, t) => (j(r, typeof e !== 'symbol' ? e + '' : e, t), t); const h = {}; L(h, { default: () => i }); const d = D(h); const u = K(f); const p = _; const S = m; const T = 'https://cdn.embed.ly/player-0.1.0.min.js'; const E = 'playerjs'; class i extends u.Component {constructor () { super(...arguments), o(this, 'callPlayer', p.callPlayer), o(this, 'duration', null), o(this, 'currentTime', null), o(this, 'secondsLoaded', null), o(this, 'mute', () => { this.callPlayer('mute') }), o(this, 'unmute', () => { this.callPlayer('unmute') }), o(this, 'ref', e => { this.iframe = e }) }componentDidMount () { this.props.onMount && this.props.onMount(this) }load (e) { (0, p.getSDK)(T, E).then(t => { this.iframe && (this.player = new t.Player(this.iframe), this.player.on('ready', () => { setTimeout(() => { this.player.isReady = !0, this.player.setLoop(this.props.loop), this.props.muted && this.player.mute(), this.addListeners(this.player, this.props), this.props.onReady() }, 500) })) }, this.props.onError) }addListeners (e, t) { e.on('play', t.onPlay), e.on('pause', t.onPause), e.on('ended', t.onEnded), e.on('error', t.onError), e.on('timeupdate', ({ duration: s, seconds: a }) => { this.duration = s, this.currentTime = a }) }play () { this.callPlayer('play') }pause () { this.callPlayer('pause') }stop () {}seekTo (e, t = !0) { this.callPlayer('setCurrentTime', e), t || this.pause() }setVolume (e) { this.callPlayer('setVolume', e) }setLoop (e) { this.callPlayer('setLoop', e) }getDuration () { return this.duration }getCurrentTime () { return this.currentTime }getSecondsLoaded () { return this.secondsLoaded }render () { const e = { width: '100%', height: '100%' }; return u.default.createElement('iframe', { ref: this.ref, src: this.props.url, frameBorder: '0', scrolling: 'no', style: e, allow: 'encrypted-media; autoplay; fullscreen;', referrerPolicy: 'no-referrer-when-downgrade' }) }}o(i, 'displayName', 'Kaltura'); o(i, 'canPlay', S.canPlay.kaltura); const M = y(d); const C = P({ __proto__: null, default: M }, [d]); export { C as K }
