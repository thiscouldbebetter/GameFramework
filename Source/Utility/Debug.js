

class Debug
{
	static doNothing()
	{
		// A call to this provides something to set a breakpoint on
		// when doing "var todo = 'todo';" causes the compiler to complain,
		// and console.log() would kill performance.
	}
}
