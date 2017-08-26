import * as childProcess from 'child_process'
import * as shell from 'shelljs'

function _command(cmd, args) {
    let HAS_NATIVE_EXECSYNC = childProcess.hasOwnProperty('spawnSync');

    let result;

    if (HAS_NATIVE_EXECSYNC) {
        result = childProcess.spawnSync(cmd, args);

        if (result.status !== 0) {
            throw new Error('[git-rev-sync] failed to execute command: ' + result.stderr);
        }

        return result.stdout.toString('utf8').replace(/^\s+|\s+$/g, '');
    }

    result = shell.exec(cmd + ' ' + args.join(' '), {silent: true});

    if (result.code !== 0) {
        throw new Error('[git-rev-sync] failed to execute command: ' + result.stdout);
    }

    return result.stdout.toString('utf8').replace(/^\s+|\s+$/g, '');
}

export function countTag(tag) {
    return parseInt(_command('git', ['rev-list', `${tag}..`, '--count']), 10);
}