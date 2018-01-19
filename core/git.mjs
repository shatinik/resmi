import childProcess from 'child_process'
import * as shell from 'shelljs'
import git from 'git-rev-sync';

export const branch = git.branch;
export const count = git.count;
export const date = git.date;
export const log = git.log;
export const long = git.long;
export const message = git.message;
export const short = git.short;
export const tag = git.tag;
export const isTagDirty = git.isTagDirty;

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

export function modified(filepath) {
    return _command('git', ['log', '-n 1', '--pretty=format:%H', filepath])
}