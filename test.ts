const path = `${Deno.cwd()}/public/sfds`;
try {
  const stats = await Deno.lstat(path);
  stats && stats.isFile;
  console.log(stats, stats.isFile, stats && stats.isFile);
} catch (e) {
  console.log("error");

  console.log(e && e instanceof Deno.errors.NotFound);
}
