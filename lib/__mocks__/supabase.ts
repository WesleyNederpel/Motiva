const mockBuilder: any = {
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  then(resolve: (v: any) => void, reject?: (r?: any) => void) {
    return Promise.resolve({ data: [], error: null }).then(resolve, reject);
  },
  catch(reject: (r?: any) => void) {
    return Promise.resolve({ data: [], error: null }).catch(reject);
  },
  finally(fn: () => void) {
    return Promise.resolve({ data: [], error: null }).finally(fn);
  },
};

export const supabase = {
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
    getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    onAuthStateChange: jest.fn().mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    }),
    updateUser: jest.fn().mockResolvedValue({ data: {}, error: null }),
    signInWithPassword: jest.fn().mockResolvedValue({ data: {}, error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
  },
  from: jest.fn().mockReturnValue(mockBuilder),
  rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
};
