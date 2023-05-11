export class AudioController {
  private traks: { [key: string]: HTMLAudioElement } = {};
  private isMuted = false;

  addSound(name: string, audio: HTMLAudioElement) {
    this.traks[name] = audio;
  }

  async play(name: string) {
    try {
      if (this.isMuted) return;
      await this.traks[name].play();
    } catch (error) {}
  }

  muted() {
    this.isMuted = true;
  }

  unMuted() {
    this.isMuted = false;
  }
}
